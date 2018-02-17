git add -A
read -p "Commit Message: " msg
git commit -m "$msg"
git push origin HEAD