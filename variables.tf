variable "aws_region" {
       description = "The AWS region to create things in."
       default     = "us-east-2"
}

variable "key_name" {
    description = " SSH keys to connect to ec2 instance"
    default     =  "jenkins2keypair"
}

variable "instance_type" {
    description = "instance type for ec2"
    default     =  "t2.small"
}

variable "security_group" {
    description = "Name of security group"
    default     = "my-terraformm-created-sec-group"
}

variable "tag_name" {
    description = "Tag Name of for Ec2 instance"
    default     = "BuildAgent2"
}
variable "ami_id" {
    description = "AMI for Ubuntu Ec2 instance"
    default     = "ami-024e6efaf93d85776"
}
variable "versioning" {
    type        = bool
    description = "(Optional) A state of versioning."
    default     = true
}
variable "acl" {
    type        = string
    description = " Defaults to private "
    default     = "private"
}
variable "bucket_prefix" {
    type        = string
    description = "(required since we are not using 'bucket') Creates a unique bucket name beginning with the specified prefix"
    default     = "my-s3bucket-"
}
variable "tags" {
    type        = map
    description = "(Optional) A mapping of tags to assign to the bucket."
    default     = {
        environment = "DEV"
        terraform   = "true"
    }
}
