terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
    backend "s3" {
    bucket       = "docart-soemyatmin-it-tfstate"
    key          = "eks-study/terraform.tfstate"
    region       = "ap-northeast-1"
    encrypt      = true
    use_lockfile = true
  }

  required_version = ">= 1.5.0"
}


provider "aws" {
  region = "ap-northeast-1"
}