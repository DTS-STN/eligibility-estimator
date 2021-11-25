## Description

In order to deploy with TeamCity, two approaches can be taken.
 1. You can configure everthing from the TC UI, however, it is easier but not recommended compared to the second option. 
 2. Taking the Configuration as Code approach allows developers to edit the deployment configurations from teh code. Thus enabling programmers to create Pull Requests for reviews. In addition, configuration as code enables more flexibility.

 The files in the current folder `.teamcity` are an example of what it would look like for an application called single-tier-application.