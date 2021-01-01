if (!(Get-Process Insomnia -ErrorAction SilentlyContinue)) 
{ Start-Process "$ENV:LocalAppData\insomnia\Insomnia" }
if (!(Get-Process robo3t -ErrorAction SilentlyContinue)) 
{ Start-Process 'C:\Program Files\Robo 3T 1.4.2\robo3t' }
(Get-Process mongod | Stop-Process) 2>$null; Start-Process mongod
& .\venv\Scripts\Activate.ps1; python .\app.py