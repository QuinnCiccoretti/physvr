find . -name '*.js' -exec sed -i 's/SlingshotViveController/SlingshotController/g' {} \;
find . -name '*.js' -exec sed -i 's/BasicViveController/BasicController/g' {} \;
find . -name '*.js' -exec sed -i 's/DragViveController/DragController/g' {} \;
find . -name '*.js' -exec sed -i 's/MoveViveController/MoveController/g' {} \;
find . -name '*.js' -exec sed -i 's/PaintViveController/PaintController/g' {} \;