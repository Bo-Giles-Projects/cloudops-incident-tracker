# CloudOps Incident Tracker
# AWS Network Infrastructure

resource "aws_vpc" "cloudops" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name    = "cloudops-vpc"
    Project = "CloudOps-Incident-Tracker"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.cloudops.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name    = "cloudops-public-subnet"
    Project = "CloudOps-Incident-Tracker"
  }
}

resource "aws_internet_gateway" "cloudops" {
  vpc_id = aws_vpc.cloudops.id

  tags = {
    Name = "cloudops-internet-gateway"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.cloudops.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.cloudops.id
  }

  tags = {
    Name = "cloudops-public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}