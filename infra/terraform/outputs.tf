# Terraform outputs
#
output "vpc_id" {
  description = "ID of the CloudOps VPC"
  value       = aws_vpc.cloudops.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}