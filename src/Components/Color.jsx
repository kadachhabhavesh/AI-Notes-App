const Color = ({ boxColor, selectedColor, setColor })=>{
    return <div onClick={() => setColor(boxColor)} className={`${selectedColor == boxColor && 'bg-blue-300'} group btn h-full aspect-square hover:bg-blue-300 rounded-md flex items-center justify-center cursor-pointer`}>
    <div style={{backgroundColor:boxColor}} className="h-6 aspect-square rounded-full cursor-pointer border-2 border-black"
    ></div>
</div>
}
export default Color