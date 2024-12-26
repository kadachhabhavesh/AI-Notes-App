import { useEffect, useRef, useState } from "react"
import rough from 'roughjs'
import { getStroke } from 'perfect-freehand'

const generator = rough.generator()


const createElement = (id, x1, y1, x2, y2, type) => {
    let roughElement;
    if (type === "line") {
        roughElement = generator.line(x1, y1, x2, y2, {
            stroke: 'white'
        })
    } else if (type === "rectangle") {
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
            stroke: 'white'
        })
    } else if (type === "circle") {
        const rx = Math.abs(x2 - x1) / 2; // Horizontal radius
        const ry = Math.abs(y2 - y1) / 2; // Vertical radius
        const cx = (x1 + x2) / 2; // Center x
        const cy = (y1 + y2) / 2; // Center y

        roughElement = generator.ellipse(cx, cy, rx * 2, ry * 2, {
            stroke: 'white',
        });
    } else if (type === "pencil") {
        return { id, type, points: [{ x: x1, y: y1 }] }
    } else if (type === "text") {
        return { id, type, x1, y1, x2, y2, text: "" }

    } else {
        throw Error(`Type not recognised${type}`)
    }
    return { id, x1, y1, x2, y2, type, roughElement }
}

const distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))

const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null
}

const positionWithInElement = (x, y, element) => {
    const { x1, y1, x2, y2, type } = element

    switch (type) {
        case "line":
            const a = { x: x1, y: y1 };
            const b = { x: x2, y: y2 };
            const c = { x: x, y: y };
            const offset = distance(a, b) - (distance(a, c) + distance(b, c))
            const start = nearPoint(x, y, x1, y1, "start")
            const end = nearPoint(x, y, x2, y2, "end")
            const on = Math.abs(offset) < 1 ? "inside" : null
            return start || end || on
            break;
        case "rectangle":
            const topLeft = nearPoint(x, y, x1, y1, "tl")
            const topRight = nearPoint(x, y, x2, y1, "tr")
            const bottomLeft = nearPoint(x, y, x1, y2, "bl")
            const bottomRight = nearPoint(x, y, x2, y2, "br")
            const insideRectangle = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null
            return topLeft || topRight || bottomLeft || bottomRight || insideRectangle
            break;
        case "circle":
            const radiusX = (x2 - x1) / 2;
            const radiusY = (y2 - y1) / 2;
            const centerX = x1 + radiusX;
            const centerY = y1 + radiusY;

            const top = nearPoint(x, y, centerX, y1, "top");
            const bottom = nearPoint(x, y, centerX, y2, "bottom");
            const left = nearPoint(x, y, x1, centerY, "left");
            const right = nearPoint(x, y, x2, centerY, "right");

            const insideCircle =
                (x - centerX) ** 2 / radiusX ** 2 +
                    (y - centerY) ** 2 / radiusY ** 2 <=
                    1
                    ? "inside"
                    : null;

            return top || bottom || left || right || insideCircle;
            break;
        case "pencil":
            const betweenAnyPoint = element.points.some((point, index) => {
                const nextPoint = element.points[index + 1]
                if (!nextPoint) return false
                const a = { x: point.x, y: point.y };
                const b = { x: nextPoint.x, y: nextPoint.y };
                const c = { x: x, y: y };
                const offset = distance(a, b) - (distance(a, c) + distance(b, c))
                const start = nearPoint(x, y, x1, y1, "start")
                const end = nearPoint(x, y, x2, y2, "end")
                const on = Math.abs(offset) < 3 ? "inside" : null
                return start || end || on
            })
            const onPath = betweenAnyPoint ? "inside" : null
            return onPath
        case "text":
            return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null
            break;
        default:
            throw Error(`Type not recognised${element.type}`)
    }


}

const getElementAtPosition = (x, y, elements) => {
    return elements
        .map(element => ({ ...element, position: positionWithInElement(x, y, element) }))
        .find(element => element.position != null)
}

const adjustElementCoordinates = element => {
    const { type, x1, y1, x2, y2 } = element
    if (type === "rectangle" || type === "circle") {
        const minX = Math.min(x1, x2)
        const maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2)
        const maxY = Math.max(y1, y2)
        return { x1: minX, y1: minY, x2: maxX, y2: maxY }
    } else if (type === "line") {
        if (x1 < x2 || (x1 == x2 && y1 < y2)) {
            return { x1, y1, x2, y2 }
        } else {
            return { x1: x2, y1: y2, x2: x1, y2: y1 }
        }
    }
}

const useHistory = initialState => {
    const [index, setIndex] = useState(0)
    const [history, setHistory] = useState([initialState])

    const setState = (action, overwrite = false) => {
        const newState = typeof action === "function" ? action(history[index]) : action
        if (overwrite) {
            const historyCopy = [...history]
            historyCopy[index] = newState
            setHistory(historyCopy)
        } else {
            const updatedState = [...history].slice(0, index + 1)
            setHistory([...updatedState, newState])
            setIndex(prevState => prevState + 1)
        }
    }

    const undo = () => index > 0 && setIndex(prevState => prevState - 1)
    const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1)

    return [history[index], setState, undo, redo]
}

const adjustmentRequired = type => ["line", "rectangle", "circle"].includes(type);

const average = (a, b) => (a + b) / 2

const getSvgPathFromStroke = (points, closed = true) => {
    const len = points.length

    if (len < 4) {
        return ``
    }

    let a = points[0]
    let b = points[1]
    const c = points[2]

    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
        2
    )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
        b[1],
        c[1]
    ).toFixed(2)} T`

    for (let i = 2, max = len - 1; i < max; i++) {
        a = points[i]
        b = points[i + 1]
        result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
            2
        )} `
    }

    if (closed) {
        result += 'Z'
    }

    return result
}

const drawElement = (roughCanvas, context, element) => {
    switch (element.type) {
        case "line":
        case "rectangle":
        case "circle":
            roughCanvas.draw(element.roughElement)
            break;
        case "pencil":
            const outlinePoints = getSvgPathFromStroke(getStroke(element.points, { size: 6, thinning: 0.7 }))
            context.fillStyle = "white";
            context.fill(new Path2D(outlinePoints))
            break;
        case "text":
            context.font = `${24}px Arial`;
            context.textBaseline = "top";
            context.fillStyle = "white";
            context.fillText(element.text, element.x1, element.y1);
            break;
        default:
            throw Error(`Type not recognised${element.type}`)
    }
}

const Calculator = () => {
    const canvasRef = useRef()
    const textAreaRef = useRef()
    const [elements, setElements, undo, redo] = useHistory([])
    const [action, setAction] = useState("none")
    const [tool, setTool] = useState("line")
    const [selectedElement, setSelectedElement] = useState(null)
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
    const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 })
    const [scale, setScale] = useState(1)
    const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const textArea = textAreaRef.current;
        if (action === "writing" && textArea) {
            setTimeout(() => {
                textArea.focus()
                textArea.value = selectedElement.text;
            }, 0);
        }
    }, [action, selectedElement])

    useEffect(() => {
        const context = canvasRef.current.getContext('2d')
        const roughCanvas = rough.canvas(canvasRef.current)
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)


        const scaleWidth = canvasRef.current.width * scale
        const scaleheight = canvasRef.current.height * scale
        const scaleOffsetX = (scaleWidth - canvasRef.current.width) / 2
        const scaleOffsetY = (scaleheight - canvasRef.current.height) / 2
        setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY })

        context.save()
        context.translate(panOffset.x * scale - scaleOffsetX, panOffset.y * scale - scaleOffsetY)
        context.scale(scale, scale)

        elements.forEach(element => {
            if (action == "writing" && element.id == selectedElement.id) return
            drawElement(roughCanvas, context, element)
        })
        context.restore()
    }, [elements, action, selectedElement, panOffset, scale])

    useEffect(() => {
        const panFunction = (event) => {
            setPanOffset((preState) => ({
                x: preState.x - event.deltaX,
                y: preState.y - event.deltaY
            }))
        };

        document.body.addEventListener("wheel", panFunction);
        return () => {
            document.body.removeEventListener("wheel", panFunction);
        };
    }, []);

    const updateElement = (id, x1, y1, x2, y2, type, options) => {
        const elementsCopy = [...elements]
        switch (type) {
            case "line":
            case "rectangle":
            case "circle":
                elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
                break;
            case "pencil":
                elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }]
                break;
            case "text":
                const textWidth = canvasRef.current.getContext('2d').measureText(options.text)
                const textHeight = 20

                elementsCopy[id] = { ...createElement(id, x1, y1, x1 + textWidth.width, y1 + textHeight, type), text: options.text }
                break;
            default:
                throw Error(`Type not recognised${type}`)
        }
        setElements(elementsCopy, true)
    }

    const getMouseCoordinates = event => {
        const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale
        const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale
        return { clientX, clientY }
    }

    const handleMouseDown = event => {
        if (action == "writing") return
        const { clientX, clientY } = getMouseCoordinates(event)

        if (event.button == 1) {
            setAction("panning")
            setStartPanMousePosition({ x: clientX, y: clientY })
        }

        if (tool == "selection") {
            const element = getElementAtPosition(clientX, clientY, elements)
            if (element) {

                if (element.type == "pencil") {
                    const xOffsets = element.points.map(point => clientX - point.x)
                    const yOffsets = element.points.map(point => clientY - point.y)
                    setSelectedElement({ ...element, xOffsets, yOffsets })
                } else {
                    const offsetX = clientX - element.x1
                    const offsetY = clientY - element.y1
                    setSelectedElement({ ...element, offsetX, offsetY })
                }
                setElements(prevState => prevState)
                if (element.position == "inside") {
                    setAction("moving")
                } else {
                    setAction("resizing")
                }
            }
        } else {
            const id = elements.length
            const element = createElement(id, clientX, clientY, clientX, clientY, tool)
            setElements(preState => [...preState, element])
            setSelectedElement(element)

            setAction(tool == "text" ? "writing" : "drawing")
        }
    }

    const cursorForPosition = position => {
        switch (position) {
            case "tl":
            case "br":
            case "start":
            case "end":
                return "nwse-resize"
            case "bl":
            case "tr":
                return "nesw-resize"
            default:
                return "move"
        }
    }

    const resizedCoordinates = (clientX, clientY, position, coordinates) => {
        const { x1, y1, x2, y2 } = coordinates
        switch (position) {
            case "tl":
            case "start":
                return { x1: clientX, y1: clientY, x2, y2 }
            case "tr":
                return { x1, y1: clientY, x2: clientX, y2 }
            case "bl":
                return { x1: clientX, y1, x2, y2: clientY }
            case "br":
            case "end":
                return { x1, y1, x2: clientX, y2: clientY }
            default:
                return null

        }
    }

    const handleMouseMove = event => {
        const { clientX, clientY } = getMouseCoordinates(event)

        if (action == "panning") {
            const deltaX = clientX - startPanMousePosition.x
            const deltaY = clientY - startPanMousePosition.y
            setPanOffset(prevState => ({
                x: prevState.x + deltaX,
                y: prevState.y + deltaY,
            }))
        }
        if (tool == "selection") {
            const element = getElementAtPosition(clientX, clientY, elements)
            event.target.style.cursor = element ? cursorForPosition(element.position) : "default"
        }
        if (action === "drawing") {
            const lastIndex = elements.length - 1
            const { x1, y1 } = elements[lastIndex]
            updateElement(lastIndex, x1, y1, clientX, clientY, tool)
        } else if (action == "moving") {

            if (selectedElement.type == "pencil") {
                const newPoints = selectedElement.points.map((point, index) => ({
                    x: clientX - selectedElement.xOffsets[index],
                    y: clientY - selectedElement.yOffsets[index]
                }))
                const elementsCopy = [...elements]
                elementsCopy[selectedElement.id] = { ...selectedElement, points: newPoints }
                setElements(elementsCopy, true)
            } else {
                const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement
                const width = x2 - x1
                const height = y2 - y1
                const newX1 = clientX - offsetX
                const newY1 = clientY - offsetY
                const options = type == "text" ? { text: selectedElement.text } : {}
                updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options)
            }

        } else if (action == "resizing") {
            const { id, type, position, ...coordinates } = selectedElement
            const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
            updateElement(id, x1, y1, x2, y2, type)
        }
    }

    const handleMouseUp = event => {
        const { clientX, clientY } = getMouseCoordinates(event)
        if (selectedElement) {

            if (
                selectedElement.type == "text" &&
                clientX - selectedElement.offsetX == selectedElement.x1 &&
                clientY - selectedElement.offsetY == selectedElement.y1
            ) {
                setAction("writing")
                return
            }

            const lastindex = selectedElement.id
            const { id, type } = elements[lastindex]
            if ((action == "drawing" || action == "resizing") && adjustmentRequired(type)) {
                const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[lastindex])
                updateElement(id, x1, y1, x2, y2, type)
            }
        }

        setAction("none")
        setSelectedElement(null)
    }

    const handleBlur = event => {
        const { id, x1, y1, type } = selectedElement
        setAction("none")
        setSelectedElement(null)
        updateElement(id, x1, y1, null, null, type, { text: event.target.value })
    }

    const onZoom = (scale) => {
        setScale(prevState => Math.min(3, Math.max(0.1, prevState + scale)))
    }

    return <div>
        <div className="fixed z-20">
            <input
                type="radio"
                id="selection"
                checked={tool == "selection"}
                onChange={() => setTool("selection")}
            /><label htmlFor="selection" className="text-white">selection</label>
            <input
                type="radio"
                id="line"
                checked={tool == "line"}
                onChange={() => setTool("line")}
            /><label htmlFor="line" className="text-white">Line</label>
            <input
                type="radio"
                id="rectangle"
                checked={tool == "rectangle"}
                onChange={() => setTool("rectangle")}
            /><label htmlFor="rectangle" className="text-white">rectangle</label>
            <input
                type="radio"
                id="text"
                checked={tool == "text"}
                onChange={() => setTool("text")}
            /><label htmlFor="text" className="text-white">text</label>
            <input
                id="circle"
                type="radio"
                checked={tool == "circle"}
                onChange={() => setTool("circle")}
            /><label htmlFor="circle" className="text-white">circle</label>
            <input
                type="radio"
                id="pencil"
                checked={tool == "pencil"}
                onChange={() => setTool("pencil")}
            /><label htmlFor="pencil" className="text-white">pencil</label>
            <button onClick={undo} className="text-white p-2 " >Undo</button>
            <button onClick={redo} className="text-white p-2 " >Redo</button>
            {action == "writing" ?
                <textarea
                    ref={textAreaRef}
                    onBlur={handleBlur}
                    className="fixed font-['Arial'] bg-transparent text-white m-0 p-0 border-none outline-none overflow-scroll whitespace-pre-wrap"
                    style={{
                        fontSize: `${24*scale}px`,
                        top: (selectedElement.y1 - 7) * scale + panOffset.y * scale - scaleOffset.y,
                        left: selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x,
                    }} /> : null}
            <div className="inline-block text-white">
                <button onClick={() => onZoom(-.2)} >-</button>
                <span className="px-2">{(scale * 100).toFixed() + "%"}</span>
                <button onClick={() => onZoom(+.2)} >+</button>
            </div>
            <button className="bg-white text-black"
            onClick={()=>{
                if(canvasRef.current){
                    const dataurl = canvasRef.current.toDataURL()
                    const image = document.createElement("a")
                    image.href = dataurl
                    image.download = "image.png"
                    image.click() 
                }
            }}
            >Save</button>
        </div>
        <canvas
            id="canvas"
            className="bg-zinc-950 z-10"
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        ></canvas>
    </div>
}


export default Calculator