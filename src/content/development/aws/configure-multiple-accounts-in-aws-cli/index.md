---
title: 'Configure multiple accounts in AWS CLI'
description: 'AWS CLI is a great tool for doing anything related to AWS. We can configure our access key for an account using an access key ID and a secret access key. But what if we want to use multiple accounts on the same computer? If we are working on multiple&#46;&#46;&#46;'
pubDate: 'Feb 19, 2021'
updatedDate: 'Oct 10, 2023'
heroImage: './hero.png'
author: 'Saransh Kataria'
categories: ["AWS"]
categoryHierarchy: ["Development","Aws"]
---

AWS CLI is a great tool for doing anything related to AWS. We can configure our access key for an account using an access key ID and a secret access key. But what if we want to use multiple accounts on the same computer? If we are working on multiple AWS projects, or have different IAM roles for different projects?

Before setting things up for multiple accounts, let us do so for a single account.

## Creating an AWS Profile

For authenticating ourselves, we need to create an AWS profile that is used for all future sessions. The access keys are used to sign our requests that are made to AWS using our program. We will first create a profile in the AWS console. And then download it in a .csv format. (If this is lost, it cannot be recovered and a new user needs to be created with the permissions again).

If we plan on using only one user profile for our communications with AWS, we can use the command:

```
$ aws configure
AWS Access Key ID [None]: 
AWS Secret Access Key [None]: 
Default region name [None]: 
Default output format [None]: json
```

This will create two files in the ~/.aws (or %USERPROFILE%.aws/ on Windows) directory. One would be credentials and the other would be configuration.

```
# ~/.aws/credentials
[default]
aws_access_key_id=Your Access Key>
aws_secret_access_key=Your Secret Access Key>

# ~/.aws/config
[default]
region=Your Region>
output=json
```

## Named AWS profile

AWS CLI allows us to setup named profiles (which will help us create multiple accounts). A named profile is simply a profile with a name attached to it. To create a named profile, we use:

```
$ aws configure --profile profile name>
```

Let us say we created a profile in AWS CLI using the name dev. The corresponding updates to the configuration files would be:

```
# ~/.aws/credentials
[default]
aws_access_key_id=Your Access Key>
aws_secret_access_key=Your Secret Access Key>

[dev]
aws_access_key_id=Dev Access Key>
aws_secret_access_key=Dev Secret Access Key>

# ~/.aws/config
[default]
region=Your Region>
output=json

[profile dev]
region=Dev Region>
output=json
```

## Configuring multiple accounts in AWS CLI

Since we can create multiple profiles, we can simply use named profiles to create multiple accounts. We can create as many profiles for as many users as we want. And the AWS CLI looks for credentials in the following order:

- **AWS CLI options:** command line arguments passed in while invoking the CLI

- **Environment variables:** exported AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY  as environment variables

- **AWS Credential file:** the file we just discussed

And the credential file can have multiple profiles as well. We will need to add the "–profile" flag while running a command in the AWS CLI if we want to use the credential file.

It can be a tedious task to specify a profile as a CLI argument every time. Therefore, an environment variable is preferred. We can even export a profile to an environment variable using:

```
export AWS_PROFILE=dev
```

The dev AWS profile will be used for all subsequent commands without the need to specify it explicitly.

And that concludes our brief setup of multiple accounts using the AWS CLI. If you have any comments, do leave a comment below.
