find . -name '*.html' -exec sed -i 's/SlingshotViveController/SlingshotController/g' {} \;
find . -name '*.html' -exec sed -i 's/BasicViveController/BasicController/g' {} \;
find . -name '*.html' -exec sed -i 's/DragViveController/DragController/g' {} \;
find . -name '*.html' -exec sed -i 's/MoveViveController/MoveController/g' {} \;
find . -name '*.html' -exec sed -i 's/PaintViveController/PaintController/g' {} \;