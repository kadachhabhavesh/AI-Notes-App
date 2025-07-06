import { useEffect, useRef, useState } from "react"
import rough from 'roughjs'
import { getStroke } from 'perfect-freehand'
import Button from "./Components/Button"

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

    function saveCanvasAndSendAPI() {
        const canvas = document.getElementById('myCanvas'); // Your canvas ID
        canvasRef.current.toBlob((blob) => {
            if (blob) {
                sendImageToServer(blob);
                console.log("successfully converted canvas to Blob");
            } else {
                console.log("Failed to convert canvas to Blob");
            }
        }, 'image/png');
    }

    async function sendImageToServer(imageBlob) {
        const formData = new FormData();
        formData.append('image', imageBlob, 'canvas_image.png'); // Append the image file
        formData.append('dict_of_vars', JSON.stringify({ x: 5, y: 10 })); // Example variables
    
        try {
            const response = await fetch('http://localhost:5000/calculate', {
                method: 'POST',
                body: formData
            });
    
            const result = await response.json();
            if (result.success) {
                console.log("AI Response:", result.result);
            } else {
                console.log("Error:", result.message);
            }
        } catch (error) {
            console.log("Error sending image:", error);
        }
    }
    

    return <div>
        <div className="fixed z-20">
            {action == "writing" ?
                <textarea
                    ref={textAreaRef}
                    onBlur={handleBlur}
                    className="fixed font-['Arial'] bg-transparent text-white m-0 p-0 border-none outline-none overflow-scroll whitespace-pre-wrap"
                    style={{
                        fontSize: `${24 * scale}px`,
                        top: (selectedElement.y1 - 7) * scale + panOffset.y * scale - scaleOffset.y,
                        left: selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x,
                    }} /> : null}
            <button className="bg-white text-black"
                onClick={saveCanvasAndSendAPI}
            >Save</button>
        </div>
        <div className="max-w-12 ml-2 absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <div className="bg-white p-1 rounded flex flex-col gap-1">
                <Button
                    Icon={<svg fill="currentColor" width="25" height="25" class="bi bi-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    </svg>}
                    IsSelected={tool == "rectangle"}
                    OnClick={() => setTool("rectangle")}
                />
                <Button
                    Icon={<svg fill="currentColor" class="bi bi-slash" viewBox="0 0 16 16">
                        <path d="M2 14L14 2" stroke="currentColor" stroke-width="1" />
                    </svg>
                    }
                    IsSelected={tool == "line"}
                    OnClick={() => setTool("line")}
                />
                <Button
                    Icon={<svg width="27" height="27" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
                        <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479z" />
                    </svg>}
                    IsSelected={tool == "text"}
                    OnClick={() => setTool("text")}
                />
                <Button
                    Icon={<svg width="25" height="25" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    </svg>}
                    IsSelected={tool == "circle"}
                    OnClick={() => setTool("circle")}
                />
                <Button
                    Icon={<svg width="23" height="23" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                    </svg>}
                    IsSelected={tool == "pencil"}
                    OnClick={() => setTool("pencil")}
                />
                <Button
                    Icon={<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-cursor-fill" viewBox="0 0 16 16">
                        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
                    </svg>}
                    IsSelected={tool == "selection"}
                    OnClick={() => setTool("selection")}
                />

            </div>
            <div className="bg-white  p-1 rounded flex flex-col gap-1">
                <Button
                    Icon={<svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0z" fill="none"/><path d="M36.79 21.2C33.11 17.97 28.29 16 23 16c-9.3 0-17.17 6.06-19.92 14.44L7.81 32c2.1-6.39 8.1-11 15.19-11 3.91 0 7.46 1.44 10.23 3.77L26 32h18V14l-7.21 7.2z"/></svg>}
                    OnClick={redo}
                />
                <Button
                    Icon={<svg height="25" viewBox="0 0 48 48" width="25" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48H0z" fill="none"/><path d="M25 16c-5.29 0-10.11 1.97-13.8 5.2L4 14v18h18l-7.23-7.23C17.54 22.44 21.09 21 25 21c7.09 0 13.09 4.61 15.19 11l4.73-1.56C42.17 22.06 34.3 16 25 16z"/></svg>}
                    OnClick={undo}
                />
            </div>
        </div>
        <div className=" ml-2 absolute right-5 bottom-5 bg-white p-1 rounded flex gap-1 items-center">
            <Button
                Icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 4V11H20V13H13V20H11V13H4V11H11V4H13Z" fill="black"/></svg>}
                OnClick={() => onZoom(+.2)}
            />
            <span className="px-2">{(scale * 100).toFixed() + "%"}</span>
            <Button
                Icon={<svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M4 11H20V13H4V11Z" fill="black"/></svg>}
                OnClick={() => onZoom(-.2)}
            />
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