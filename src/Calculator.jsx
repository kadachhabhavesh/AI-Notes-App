import { useEffect, useRef, useState } from "react"
import Color from "./Components/Color"
import ShapeDropDown from './Components/ShapeDropDown'
const Calculator = () => {
    const canvasRef = useRef()
    const [context, setContext] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#fff")
    const [isErasing, setIsErasing] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [solution, setSolution] = useState("")
    const [selectShape, setSelectShape] = useState('line') //circle,square and line
    const [startPosition, setStartPosition] = useState()
    const [shapes, setShapes] = useState([]);


    useEffect(() => {
        console.log(selectShape);
    }, [selectShape])

    const startDrawing = (e) => {
        const ctx = canvasRef.current.getContext('2d')
        setContext(ctx)
        setStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
        ctx.beginPath()
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        setIsDrawing(true)
    }

    const drawing = (e) => {
        if (!isDrawing) return;
        if (selectShape == 'line') {
            context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            context.strokeStyle = isErasing ? 'transparent' : color
            context.lineWidth = isErasing ? 10 : 2
            context.lineCap = 'round'
            context.stroke()
        } else if (selectShape == 'square') {
            if (!startPosition) return;

            const currentX = e.nativeEvent.offsetX;
            const currentY = e.nativeEvent.offsetY;

            const width = currentX - startPosition.x;
            const height = currentY - startPosition.y;

            // Clear the canvas for live updates
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            context.beginPath();
            context.rect(startPosition.x, startPosition.y, width, height);
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.stroke();
        } else if (selectShape == 'circle') {
            if (!startPosition) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
        
            const dx = e.nativeEvent.offsetX - startPosition.x;
            const dy = e.nativeEvent.offsetY - startPosition.y;
            const radius = Math.sqrt(dx * dx + dy * dy);
        
            // Draw the circle without clearing the entire canvas
            ctx.beginPath();
            ctx.arc(startPosition.x, startPosition.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    const stopDrawing = (e) => {
        if (!drawing) return;
        setStartPosition(null)
        setIsDrawing(false)
    }

    const Calculate = () => {
        canvasRef.current.toBlob(async (imageBlob) => {
            const formData = new FormData()
            formData.append('image', imageBlob)
            formData.append('dict_of_vars', JSON.stringify(dictOfVars))

            setSolution("AI Preparing Solution...")
            try {
                const res = await fetch("http://localhost:5000/calculate", {
                    method: "POST",
                    body: formData
                })
                const resData = await res.json()
                console.log(resData);
                // setDictOfVars(resData.)
                setSolution(resData.result)
            } catch (error) {
                const startDrawing = (e) => {
                    const ctx = canvasRef.current.getContext('2d')
                    setContext(ctx)
                    ctx.beginPath()
                    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
                    setIsDrawing(true)
                }
                console.log(error, 46);
            }

        })
    }

    const reset = () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        setSolution("")
    }

    const toggleEraser = () => {
        setIsErasing(!isErasing)
        setIsDrawing(false)
    }

    const selectColor = (e) => {
        setColor(e.target.value);
    }


    return <div className="w-full h-screen bg-zinc-600 flex items-center justify-between relative">
        {/* canvas */}
        <canvas
            ref={canvasRef}
            width={935}
            height={775}
            className="bg-zinc-950"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={drawing}
            onMouseLeave={stopDrawing}
        ></canvas>

        {/* output window */}
        <div className="h-full w-[600px] bg-white p-3 pb-10">
            <h1 className="font-semibold text-4xl mb-4 font-itim text-center">Solution</h1>
            <div className="w-full h-[95%] overflow-y-scroll text-wrap break-words" >
                <pre className="text-wrap font-itim text-xl">
                    {solution}
                </pre>
            </div>
        </div>

        {/* menu bar */}
        <div className="absolute top-2 left-2 flex gap-3">
            <div className="menu bg-white w-[390px] h-12 shadow-2xl rounded-md p-1 flex">
                <div className={`group btn h-full aspect-square hover:bg-blue-300 rounded-md flex items-center justify-center cursor-pointer ${!isErasing && 'bg-blue-300 rounded-md'}`} onClick={toggleEraser}>
                    <svg width="20" height="20" className={`bi bi-cursor-fill group-hover:fill-blue-700 ${!isErasing && 'fill-blue-700'}`} viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z" />
                        <path fill-rule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z" />
                    </svg>
                </div>
                <div className={`group btn h-full aspect-square hover:bg-blue-300 rounded-md flex items-center justify-center cursor-pointer ${isErasing && 'bg-blue-300 rounded-md'}`} onClick={toggleEraser}>
                    <svg width="20" height="20" className={`bi bi-eraser-fill group-hover:fill-blue-700 ${isErasing && 'fill-blue-700'}`} viewBox="0 0 16 16">
                        <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z" />
                    </svg>
                </div>
                <div className={`group btn h-full aspect-square hover:bg-blue-300 rounded-md flex items-center justify-center cursor-pointer`} >
                    <ShapeDropDown selectShape={selectShape} setSelectShape={setSelectShape} />
                </div>
                <div className={`group btn h-full aspect-square hover:bg-blue-300 rounded-md flex items-center justify-center cursor-pointer`} >
                    <svg className={`bi bi-eraser-fill group-hover:fill-blue-700`} width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479z" />
                    </svg>
                </div>
                {/* <div className="group btn h-full aspect-square hover:bg-blue-300 rounded-md flex items-center justify-center cursor-pointer">
                <svg width="20" height="20" className="bi bi-vector-pen group-hover:fill-blue-700" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z" />
                    <path fill-rule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086z" />
                </svg>
            </div> */}
                <Color boxColor="#111" selectedColor={color} setColor={setColor} />
                <Color boxColor="#fff" selectedColor={color} setColor={setColor} />
                <Color boxColor="#b91c1c" selectedColor={color} setColor={setColor} />
                <Color boxColor="#15803d" selectedColor={color} setColor={setColor} />
                <Color boxColor="#1d4ed8" selectedColor={color} setColor={setColor} />
            </div>
            <button className="bg-white rounded-md px-4 font-itim text-xl" onClick={reset}>Reset</button>
            <button className="bg-white rounded-md px-4 font-itim text-xl" onClick={Calculate}>Calculate</button>
            <input type="text" className="rounded-md w-64 p-" />
        </div>
    </div >
}

export default Calculator