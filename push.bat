@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
%GIT% add .
%GIT% commit -m "Update API URLs for Deployment"
%GIT% push origin main
