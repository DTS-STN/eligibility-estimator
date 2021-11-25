import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.vcs.GitVcsRoot
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.dockerCommand
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs
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
    buildType(Build)
}

object HttpsGithubComDtsStnsingleTierAppliction : GitVcsRoot({
    name = "https://github.com/DTS-STN/single-tier-appliction"
    url = "git@github.com:DTS-STN/single-tier-appliction.git"
    branch = "refs/heads/adding-teamcity-steps"
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "dtsrobot"
    }
})

object Build: BuildType({
    name = "Build"
    description = "Continuous integration"
    params {
        param("env.PROJECT", "single-tier-appliction")
        param("env.BASE_DOMAIN","bdm-dev.dts-stn.com")
        param("env.SUBSCRIPTION", "%vault:dts-sre/azure!/decd-dev-subscription-id%")
        param("env.K8S_CLUSTER_NAME", "ESdCDPSBDMK8SDev-K8S-admin")
        param("env.RG_DEV", "ESdCDPSBDMK8SDev")
    }
    vcs {
        root(HttpsGithubComDtsStnsingleTierAppliction)
    }
   
    steps {
        dockerCommand {
            name = "Build & Tag Docker Image"
            commandType = build {
                source = file {
                    path = "Dockerfile"
                }
                namesAndTags = "%env.ACR_DOMAIN%/%env.PROJECT%:%env.DOCKER_TAG%"
                commandArgs = "--pull --build-arg BUILD_DATE=%system.build.start.date% --build-arg TC_BUILD=%build.number% --build-arg CONTENT_API=https://www.canada.ca/api/assets/decd-endc/content-fragments/ --build-arg NEXT_PUBLIC_FEEDBACK_API=https://alphasite.dts-stn.com/api/feedback"
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
                az aks get-credentials --admin --resource-group %env.RG_DEV% --name %env.K8S_CLUSTER_NAME%
                helmfile -e %env.TARGET% apply
            """.trimIndent()
        }
    }
    triggers {
        vcs {
            branchFilter = "+:<default>"
        }
    }
})