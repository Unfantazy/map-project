import {useState} from "react";
import {ReactComponent  as SearchIcon} from '../images/icons/search.svg'
import {ReactComponent  as CloseIcon} from '../images/icons/close.svg'
import Loader from "./Loader";
import FilterSelect from "./FilterSelect";


const Menu = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('')

    const onMenuToggle = () => {
        setIsVisible(!isVisible)
    }
    const onSearchBtnClick = () => {
        if (filter) {
        setIsLoading(true)
            setTimeout(() => {
                alert('Searching process')
                setIsLoading(false)
            }, 1000)
        }
    }

    return (
        <>
            {isLoading && <Loader />}
        <div className={`Menu ${isVisible ? 'isVisible' : ''}`}>
            <div className='Menu-show-button' onClick={onMenuToggle}>
                click
            </div>
            <div className='Menu-wrapper'>
                <FilterSelect />
                <FilterSelect />
            </div>
        </div>
        </>
    );
}

export default Menu;
