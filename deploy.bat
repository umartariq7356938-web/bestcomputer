@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
%GIT% init
%GIT% add .
%GIT% commit -m "Initial commit of Best Computer AI Studio"
%GIT% branch -M main
%GIT% remote add origin https://github.com/umartariq7356938-web/bestcomputer.git
%GIT% push -u origin main
