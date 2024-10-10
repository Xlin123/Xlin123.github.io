terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}

variable "container_port" {
  type = number
}

resource "docker_volume" "db_data" {
  name = "db_data"
}

resource "docker_network" "net" {
  name = "net"
}

resource "docker_image" "alpine" {
  name         = ":latest"
  keep_locally = false
}

resource "docker_container" "alpine" {
  image = docker_image.alpine.image_id
  name  = "alpine-box"
  ports {
    internal = 22
    external = 8001
  }
}



