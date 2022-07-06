import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.ScheduleTrigger
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
    vcsRoot(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorPerformance)
    vcsRoot(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorMain)
    vcsRoot(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop)
    vcsRoot(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDynamic)
    buildType(Build_Performance)
    buildType(Build_Main)
    buildType(Build_Develop)
    buildType(Build_Dynamic)
    buildType(CleanUpWeekly)
}

object Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorPerformance : GitVcsRoot({
    name = "https://github.com/DTS-STN/eligibility-estimator/tree/_performance"
    url = "git@github.com:DTS-STN/eligibility-estimator.git"
    branch = "refs/heads/main"
    branchSpec = "+:refs/heads/main"
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "dtsrobot"
    }
})

object Dev_EligibilityEstimator_HttpsGithubComDtsStneligibilityEstimatorMain : GitVcsRoot({
    name = "https://github.com/DTS-STN/eligibility-estimator/tree/_main"
    url = "git@github.com:DTS-STN/eligibility-estimator.git"
    useTagsAsBranches = true
    branch = "refs/heads/main"
    branchSpec = "+:refs/tags/*"
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "dtsrobot"
    }
})

object Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDevelop : GitVcsRoot({
    name = "https://github.com/DTS-STN/eligibility-estimator/tree/_develop"
    url = "git@github.com:DTS-STN/eligibility-estimator.git"
    branch = "refs/heads/develop"
    branchSpec = "+:refs/heads/develop"
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "dtsrobot"
    }
})

object Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDynamic : GitVcsRoot({
    name = "https://github.com/DTS-STN/eligibility-estimator/tree/_dynamic"
    url = "git@github.com:DTS-STN/eligibility-estimator.git"
    branch = "refs/heads/develop"
    branchSpec = "+:refs/heads/*"
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "dtsrobot"
    }
})


/* Try and keep env.PROJECT value will be used throughout the helm scripts                 */
/* to build urls, name the application and many other things.  folders and files in the    */
/* helmfile directory should also match this value.                                        */
object Build_Develop: BuildType({
    name = "Build_Develop"
    description = "Builds and deploys our main branch on update to main url"
    params {
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
        param("env.PROJECT", "eligibility-estimator")
        param("env.BASE_DOMAIN","bdm-dev.dts-stn.com")
        param("env.SUBSCRIPTION", "%vault:dts-sre/data/azure!/decd-dev-subscription-id%")
        param("env.K8S_CLUSTER_NAME", "ESdCDPSBDMK8SDev-K8S")
        param("env.RG_DEV", "ESdCDPSBDMK8SDev")
        param("env.TARGET", "main")
        param("env.BRANCH", "develop")
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
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number%"
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.TENANT-ID%
                az account set -s %env.SUBSCRIPTION%
                az acr login -n MTSContainers
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.RG_DEV% --name %env.K8S_CLUSTER_NAME%
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
    triggers {
        vcs {
            branchFilter = "+:*"
        }
    }
})


object Build_Dynamic: BuildType({
    name = "Build_Dynamic"
    description = "Dynamic branching; builds and deploys every branch"
    params {
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
        param("env.PROJECT", "eligibility-estimator")
        param("env.BASE_DOMAIN","bdm-dev.dts-stn.com")
        param("env.SUBSCRIPTION", "%vault:dts-sre/data/azure!/decd-dev-subscription-id%")
        param("env.K8S_CLUSTER_NAME", "ESdCDPSBDMK8SDev-K8S")
        param("env.RG_DEV", "ESdCDPSBDMK8SDev")
        param("env.TARGET", "main")
        param("env.BRANCH", "dyna-%teamcity.build.branch%")
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
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number%"
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.TENANT-ID%
                az account set -s %env.SUBSCRIPTION%
                az acr login -n MTSContainers
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.RG_DEV% --name %env.K8S_CLUSTER_NAME%
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
    triggers {
        vcs {
            branchFilter = """
                    +:*
                    -:main
                    -:gh-pages
                    """.trimIndent()
        }
    }
})


object Build_Main: BuildType({
    name = "Build_Main"
    description = "Pushes Main tags as defacto Main builds"
    params {
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
        param("env.PROJECT", "eligibility-estimator")
        param("env.BASE_DOMAIN","bdm-dev.dts-stn.com")
        param("env.SUBSCRIPTION", "%vault:dts-sre/data/azure!/decd-dev-subscription-id%")
        param("env.K8S_CLUSTER_NAME", "ESdCDPSBDMK8SDev-K8S")
        param("env.RG_DEV", "ESdCDPSBDMK8SDev")
        param("env.TARGET", "main")
        param("env.BRANCH", "main")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorMain)
    }
    
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number%"
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.TENANT-ID%
                az account set -s %env.SUBSCRIPTION%
                az acr login -n MTSContainers
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.RG_DEV% --name %env.K8S_CLUSTER_NAME%
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
    triggers {
        vcs {
            branchFilter = """
                    +:*
                    -:refs/heads/main
                    """.trimIndent()
        }
    }
})


object Build_Performance: BuildType({
    name = "Build_Performance"
    description = "Builds and deploys our main branch on update to perf url"
    params {
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
        param("env.PROJECT", "eligibility-estimator")
        param("env.BASE_DOMAIN","bdm-dev.dts-stn.com")
        param("env.SUBSCRIPTION", "%vault:dts-sre/data/azure!/decd-dev-subscription-id%")
        param("env.K8S_CLUSTER_NAME", "ESdCDPSBDMK8SDev-K8S")
        param("env.RG_DEV", "ESdCDPSBDMK8SDev")
        param("env.TARGET", "main")
        param("env.BRANCH", "perf")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorPerformance)
    }
    
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg NEXT_BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number%"
            }
        }
        script {
            name = "Login to Azure and ACR"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.TENANT-ID%
                az account set -s %env.SUBSCRIPTION%
                az acr login -n MTSContainers
            """.trimIndent()
        }
        dockerCommand {
            name = "Push Image to ACR"
            commandType = push {
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
            }
        }
        script {
            name = "Deploy w/ Helmfile"
            scriptContent = """
                cd ./helmfile
                az account set -s %env.SUBSCRIPTION%
                az aks get-credentials --overwrite-existing --admin --resource-group %env.RG_DEV% --name %env.K8S_CLUSTER_NAME%
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
    triggers {
        vcs {
            branchFilter = "+:*"
        }
    }
})

object CleanUpWeekly: BuildType({
    name = "CleanUpWeekly"
    description = "Deletes deployments every saturday"
    params {
        param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
        param("env.PROJECT", "eligibility-estimator")
        param("env.BASE_DOMAIN","bdm-dev.dts-stn.com")
        param("env.SUBSCRIPTION", "%vault:dts-sre/data/azure!/decd-dev-subscription-id%")
        param("env.K8S_CLUSTER_NAME", "ESdCDPSBDMK8SDev-K8S")
        param("env.RG_DEV", "ESdCDPSBDMK8SDev")
        param("env.TARGET", "main")
        param("env.BRANCH", "%teamcity.build.branch%")
    }
    vcs {
        root(Dev_EligibilityEstimator_HttpsGithubComDtsStnEligibilityEstimatorDynamic)
    }
    steps {
        script {
            name = "Login and Delete Deployment"
            scriptContent = """
                az login --service-principal -u %TEAMCITY_USER% -p %TEAMCITY_PASS% --tenant %env.TENANT-ID%
                az account set -s %env.SUBSCRIPTION%
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
