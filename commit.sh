git add -A
read -p "Commit message: " msg
git commit -m "$msg"
git push
jsdoc -r js/ README.md
