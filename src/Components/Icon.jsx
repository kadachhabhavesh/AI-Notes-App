const Icon = ()=>{
    return <div className={`group btn h-full aspect-square hover:bg-blue-300 rounded-md flex items-center justify-center cursor-pointer ${!isErasing && 'bg-blue-300 rounded-md'}`} onClick={toggleEraser}>
    <svg className={`bi bi-cursor-fill group-hover:fill-blue-700 ${!isErasing && 'fill-blue-700'}`} width="20" height="20" viewBox="0 0 16 16">
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
    </svg>
</div>
}
export default Icon