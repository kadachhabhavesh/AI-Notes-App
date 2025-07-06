const Button = ({ Icon, IsSelected, OnClick }) => {
    return (
        <div 
            className={`aspect-square w-10 rounded cursor-pointer flex items-center justify-center p-2
            ${IsSelected ? 'bg-blue-300' : 'hover:bg-blue-300'}`}
            onClick={OnClick}
        >
            {Icon}
        </div>
    );
};

export default Button;
