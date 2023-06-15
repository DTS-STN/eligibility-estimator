import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.ScheduleTrigger


/*
the contents of these settings are almost a copy of the settings on teamcity 
use the variables and values for reference
*/


/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.
VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.
To debug settings scripts in command-line, run the
    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate
command and attach your debugger to the port 8000.
To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2020.2"

project {
    vcsRoot(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop)
    vcsRoot(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDynamic)
    buildType(Build_Develop)
    buildType(Build_Staging)
    buildType(Build_Dynamic)
    buildType(Build_Alpha)
    buildType(Build_Prod)
    buildType(CleanUpWeekly)
    //
    // global parameters
    params{
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true") 	
        param("TEAMCITY_PASS", "%vault:bdm-dev-eligibility-estimator/TEAMCITY!/TEAMCITY_SPN_PASSWORD%")
        param("TEAMCITY_USER", "%vault:bdm-dev-eligibility-estimator/TEAMCITY!/TEAMCITY_SPN_ID%")
        param("env.ADOBE_ANALYTICS_URL", "%vault:bdm-dev-eligibility-estimator/TEAMCITY!/ADOBE_ANALYTICS_URL%")
        param("env.BASE_DOMAIN", "bdm-dev-rhp.dts-stn.com")
        param("env.CLOUD_ACR_DOMAIN", "%vault:dts-common/data/AZURE_BDM_DEV_SUB!/CLOUD_ACR_DOMAIN%")
        param("env.CLOUD_K8S_CLUSTER_NAME", "%vault:dts-common/data/AZURE_BDM_DEV_SUB!/CLOUD_K8S_CLUSTER_NAME%")
        param("env.CLOUD_K8S_RG", "%vault:dts-common/data/AZURE_BDM_DEV_SUB!/CLOUD_K8S_RG%")
        param("env.CLOUD_SUBSCRIPTION", "%vault:dts-common/data/AZURE_BDM_DEV_SUB!/CLOUD_SUBSCRIPTION%")
        param("env.CLOUD_TENANT-ID", "%vault:dts-common/data/AZURE_BDM_DEV_SUB!/CLOUD_TENANT_ID%")
        param("env.ENVIRONMENT", "")
        param("env.NEXTAUTH_URL", "env.NEXTAUTH_URL")
        param("env.APP_ENV", "env.APP_ENV")
        param("env.NEXTAUTH_SECRET", "env.NEXTAUTH_SECRET")
        param("env.NEXT_AUTH_USERNAME", "env.NEXT_AUTH_USERNAME")
        param("env.NEXT_AUTH_PASSWORD", "env.NEXT_AUTH_PASSWORD")
        param("env.SUB_DOMAIN", "ep-be")
        param("env.SUB_DOMAIN_PATH", "%env.SUB_DOMAIN%")
        param("env.PROJECT", "eligibility-estimator")
    }
}

object Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop : GitVcsRoot({
    name = "https://github.com/DTS-STN/eligibility-estimator/tree/_develop"
    url = "git@github.com:DTS-STN/eligibility-estimator.git"
    branch = "refs/heads/develop"
    branchSpec = "+:refs/heads/develop"
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "DTS_GITHUB_SSH_KEY"
        passphrase = "************"
    }
})

object Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDynamic : GitVcsRoot({
    name = "https://github.com/DTS-STN/eligibility-estimator/tree/_dynamic"
    url = "git@github.com:DTS-STN/eligibility-estimator.git"
    branch = "refs/heads/develop"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "DTS_GITHUB_SSH_KEY"
        passphrase = "************"
    }
})


/* Try and keep env.PROJECT value will be used throughout the helm scripts                 */
/* to build urls, name the application and many other things.  folders and files in the    */
/* helmfile directory should also match this value.                                        */

object Build_Develop: BuildType({
    name = "Build_Develop"
    description = "Builds and deploys our develop branch on update to develop url"
    params {
        param("env.TARGET", "dev")
        param("env.DOCKER_TAG", "TC-%build.number%-dev")
        param("env.ENVIRONMENT", "develop")
        param("env.SUB_DOMAIN_PATH", "%env.SUB_DOMAIN%-%env.ENVIRONMENT%")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop)
    }
    
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number% --build-arg ADOBE_ANALYTICS_URL=%env.ADOBE_ANALYTICS_URL% --build-arg NEXTAUTH_URL=%env.NEXTAUTH_URL% --build-arg APP_ENV=%env.APP_ENV% --build-arg NEXTAUTH_SECRET=%env.NEXTAUTH_SECRET% --build-arg NEXT_AUTH_USERNAME=%env.NEXT_AUTH_USERNAME% --build-arg NEXT_AUTH_PASSWORD=%env.NEXT_AUTH_PASSWORD% "
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.CLOUD_TENANT-ID%
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az acr login -n %env.CLOUD_ACR_DOMAIN%
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.CLOUD_K8S_RG% --name %env.CLOUD_K8S_CLUSTER_NAME%
                kubectl config use-context %env.CLOUD_K8S_CLUSTER_NAME%-admin
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
})


object Build_Staging: BuildType({
    name = "Build_Staging"
    description = "Builds and deploys our main branch on update to staging url"
    params {
        param("env.TARGET", "staging")
        param("env.DOCKER_TAG", "TC-%build.number%-staging")
        param("env.ENVIRONMENT", "staging")
        param("env.SUB_DOMAIN_PATH", "%env.SUB_DOMAIN%-%env.ENVIRONMENT%")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop)
    }
    
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number% --build-arg ADOBE_ANALYTICS_URL=%env.ADOBE_ANALYTICS_URL% --build-arg NEXTAUTH_URL=%env.NEXTAUTH_URL% --build-arg NEXTAUTH_SECRET=%env.NEXTAUTH_SECRET% --build-arg NEXT_AUTH_USERNAME=%env.NEXT_AUTH_USERNAME% --build-arg NEXT_AUTH_PASSWORD=%env.NEXT_AUTH_PASSWORD% "
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.CLOUD_TENANT-ID%
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az acr login -n %env.CLOUD_ACR_DOMAIN%
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.CLOUD_K8S_RG% --name %env.CLOUD_K8S_CLUSTER_NAME%
                kubectl config use-context %env.CLOUD_K8S_CLUSTER_NAME%-admin
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
})


object Build_Dynamic: BuildType({
    name = "Build_Dynamic"
    description = "Dynamic branching; builds and deploys every branch"
    params {
        param("env.TARGET", "dyna")
        param("env.DOCKER_TAG", "TC-%build.number%-dyna")
        param("env.BRANCH", "%teamcity.build.branch%")
        param("env.ENVIRONMENT", "dyna")
        param("env.SUB_DOMAIN_PATH", "%env.SUB_DOMAIN%-%env.ENVIRONMENT%-%env.BRANCH%")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDynamic)
    }
    
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number% --build-arg ADOBE_ANALYTICS_URL=%env.ADOBE_ANALYTICS_URL% --build-arg NEXTAUTH_URL=%env.NEXTAUTH_URL% --build-arg NEXTAUTH_SECRET=%env.NEXTAUTH_SECRET% --build-arg NEXT_AUTH_USERNAME=%env.NEXT_AUTH_USERNAME% --build-arg NEXT_AUTH_PASSWORD=%env.NEXT_AUTH_PASSWORD% "
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.CLOUD_TENANT-ID%
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az acr login -n %env.CLOUD_ACR_DOMAIN%
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.CLOUD_K8S_RG% --name %env.CLOUD_K8S_CLUSTER_NAME%
                kubectl config use-context %env.CLOUD_K8S_CLUSTER_NAME%-admin
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
    triggers {
        vcs {
            branchFilter = """
                    +:*
                    -:develop
                    -:staging
                    -:main
                    """.trimIndent()
        }
    }
})


object Build_Alpha: BuildType({
    name = "Build_Alpha"
    description = "Builds and deploys our develop branch to alpha SC Labs url"
    params {
        param("env.TARGET", "alpha")
        param("env.BASE_DOMAIN", "service.canada.ca")
        param("env.DOCKER_TAG", "TC-%build.number%-alpha")
        param("env.ENVIRONMENT", "alpha")
        param("env.SUB_DOMAIN_PATH", "%env.SUB_DOMAIN%.%env.ENVIRONMENT%")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop)
    }
    
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number% --build-arg ADOBE_ANALYTICS_URL=%env.ADOBE_ANALYTICS_URL% --build-arg NEXTAUTH_URL=%env.NEXTAUTH_URL% --build-arg NEXTAUTH_SECRET=%env.NEXTAUTH_SECRET% --build-arg NEXT_AUTH_USERNAME=%env.NEXT_AUTH_USERNAME% --build-arg NEXT_AUTH_PASSWORD=%env.NEXT_AUTH_PASSWORD% "
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.CLOUD_TENANT-ID%
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az acr login -n %env.CLOUD_ACR_DOMAIN%
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.CLOUD_K8S_RG% --name %env.CLOUD_K8S_CLUSTER_NAME%
                kubectl config use-context %env.CLOUD_K8S_CLUSTER_NAME%-admin
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
})


object Build_Prod: BuildType({
    name = "Build_Prod"
    description = "Builds and deploys our main develop on command to service canada"
    params {
        param("env.TARGET", "prod")
        param("env.BASE_DOMAIN", "service.canada.ca")
        param("env.DOCKER_TAG", "TC-%build.number%-prod")
        param("env.SUB_DOMAIN_PATH", "%env.SUB_DOMAIN%")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop)
    }
    
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number% --build-arg ADOBE_ANALYTICS_URL=%env.ADOBE_ANALYTICS_URL% --build-arg NEXTAUTH_URL=%env.NEXTAUTH_URL% --build-arg NEXTAUTH_SECRET=%env.NEXTAUTH_SECRET% --build-arg NEXT_AUTH_USERNAME=%env.NEXT_AUTH_USERNAME% --build-arg NEXT_AUTH_PASSWORD=%env.NEXT_AUTH_PASSWORD% "
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.CLOUD_TENANT-ID%
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az acr login -n %env.CLOUD_ACR_DOMAIN%
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.CLOUD_ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.CLOUD_SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.CLOUD_K8S_RG% --name %env.CLOUD_K8S_CLUSTER_NAME%
                kubectl config use-context %env.CLOUD_K8S_CLUSTER_NAME%-admin
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
})


object CleanUpWeekly: BuildType({
    name = "CleanUpWeekly"
    description = "Deletes deployments every saturday"
    params {
        param("env.TARGET", "dyna")
        param("env.BRANCH", "dyna-%teamcity.build.branch%")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDynamic)
    }
    steps {
        script {
            name = "Login and Delete Deployment"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.CLOUD_TENANT-ID%
                az account set -s %env.CLOUD_SUBSCRIPTION%
                echo %env.PROJECT%-branch
                kubectl get namespace | awk '/^%env.PROJECT%-dyna/{system("kubectl delete namespace " $1)}'
            """.trimIndent()
        }
    }
    triggers {
        schedule {
            schedulingPolicy = weekly {
                dayOfWeek = ScheduleTrigger.DAY.Saturday
                hour = 15
                minute = 15
                timezone = "America/New_York"
            }  
            branchFilter = "+:main"
            triggerBuild = always()
            withPendingChangesOnly = false
            triggerBuildOnAllCompatibleAgents = true
        }
    }
})
