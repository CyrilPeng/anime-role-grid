@echo off
echo WARNING: This will DELETE ALL DATA from the remote 'anime-grid-db' database.
echo Press Ctrl+C to cancel, or any key to continue...
pause
call npx wrangler d1 execute anime-grid-db --remote --command "DELETE FROM save_items; DELETE FROM saves;"
echo.
echo Database cleared.
pause
