import GooseSvg from '../svg/goose.svg?react'

type Props = { 
    disabled?: boolean; 
    onTap?: () => void;
};

export default function Goose({ disabled, onTap}: Props) {
    return (
        <div 
            className={`goose`} 
            role="button" 
            aria-disabled={disabled}
            style={ !disabled ? {cursor: "pointer"} : {} }
            onClick={() => !disabled && onTap?.()}
        >
            <GooseSvg width={"100%"} height={"100%"}/>
        </div>
    );
}