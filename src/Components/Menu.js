import {useState} from "react";
import {ReactComponent  as SearchIcon} from '../images/icons/search.svg'
import {ReactComponent  as CloseIcon} from '../images/icons/close.svg'
import Loader from "./Loader";


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
                <div className={'Menu-search'}>
                    <input type="text"
                           value={filter}
                           onChange={(e) => setFilter(e.currentTarget.value)}/>
                    <button className={'Menu-search-btn'}
                    onClick={onSearchBtnClick}>
                        <SearchIcon/>
                    </button>
                    {filter
                    && <button className={'Menu-search-btn Menu-search-btn--close'}
                            onClick={() => setFilter('')}>
                        <CloseIcon/>
                    </button>
                    }
                </div>
                <ul className={'menu-filter'}>
                    <li className={'menu-filter-item'}>Фильтр 1</li>
                    <li className={'menu-filter-item'}>Фильтр 2</li>
                </ul>
            </div>
        </div>
        </>
    );
}

export default Menu;
