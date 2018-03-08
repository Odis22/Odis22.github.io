# linux-server-udacity-fullstack

ip connection: 35.166.84.180

After logging in to the server this is what I did :

3. Create username named grader
adduser grader

Set password prompts:
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully

User information prompts:
Changing the user information for username
Enter the new value, or press ENTER for the default
    Full Name []:
    Room Number []:
    Work Phone []:
    Home Phone []:
    Other []:
Is the information correct? [Y/n]

The user is grader and the password is burrito1

4. Give the grader the permission to sudo

usermod -aG sudo grader

5. Update all currently installed packages

apt-get update #Fetches the list of available updates
apt-get upgrade #Strictly upgrades the current packages

6. Change SSH port from 22 to 2200

nano /etc/ssh/sshd_config

Inside nano change the Port directive from 22 to 2200. Press Ctrl + x to exit and Y to the prompt to overwrite the file. Then use this command to restart the ssh service : service ssh restart

7. Configure UFW to only allow incoming connections for SSH (2200), HTTP(80) and NTP(123)

ufw allow 2200
ufw allow 80
ufw allow 123
ufw enable

You can use "ufw status verbose" to see the active rules and status of UFW

8. Configure the local timezone to UTC

dpkg-reconfigure tzdata
In the prompt select "None of the above" and then "UTC"

9. Install Apache and mod_wsgi

apt-get install apache2 python-setuptools libapache2-mod-wsgi

10. Install PostgreSQL and do not allow remote connections. Add username called "catalog" with permissions only to the database "catalog".

apt-get install postgresql postgresql-contrib

PostgreSQL does not allow remote connections with default configuration.

Add user "catalog" and database "catalog" use this command

su - postgres
psql

CREATE USER catalog with PASSWORD 'burrito1';

CREATE DATABASE catalog OWNER catalog;

/q #Command to exit psql

Now grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE catalog to catalog;

11. Install git, clone and setup your catalog app

apt-get install git #command to install git

git clone https://github.com/Odis22/271653_ijhs7.git /var/www/html/catalogapp
