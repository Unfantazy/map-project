import Tag from "./Tag";
import {ReactComponent  as SearchIcon} from '../images/icons/search.svg'
import {ReactComponent  as CrossIcon} from '../images/icons/cross-grey.svg'
import {useCallback, useMemo, useRef, useState} from "react";
import {includes} from "lodash";
import {useOnClickOutside} from "../customHooks/useOnClickOutside";

const FilterSelect = ({ placeholder= 'Введите название спорт объекта' }) => {
    const [isFocused, setIsFocused] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [filter, setFilter] = useState('')

    const filterRef = useRef(null)

    const mock1 = [
        {id: 1, title: 'Москва'},
        {id: 2, title: 'Питер'},
        {id: 3, title: 'Новомоссковск'},
        {id: 4, title: 'Просто длинное название'},
        {id: 5, title: 'Огнище огненное'},
    ]

    const selectedItemsIds = useMemo(() => {
        return selectedItems.map(item => item.id)
    }, [selectedItems])

    const onDeleteItem = useCallback((id) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id))
    }, [selectedItems])

    const onSelectItem = (item) => {
        if(!includes(selectedItems.map(item => item.id), item.id)) {
            setSelectedItems([...selectedItems, item])
        } else {
            setSelectedItems(selectedItems.filter(focusedItem => focusedItem.id !== item.id))
        }
    }

    useOnClickOutside(filterRef, () => {
        setIsFocused(false)
    })

    return (
        <div className={'Filter-select'}
             ref={filterRef}>
            <div className={`select__btn ${isFocused && 'isFocused'}`}
            onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setIsFocused(true)
            }}>
                <div className={`tags-container scroller`}>
                    {selectedItems.map(item => {
                        return <Tag
                            title={item.title}
                            onDelete={(e) => {
                                e.stopPropagation()
                                onDeleteItem(item.id)
                            }}
                        />
                    })}

                </div>
                <label className={'select-label'}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder={placeholder}
                        className={'select-input'}
                        value={filter}
                        onChange={(e) => setFilter(e.currentTarget.value)}
                    />
                    {filter &&
                    <CrossIcon style={{cursor: 'pointer'}}
                    onClick={() => setFilter('')}
                    />
                    }
                </label>
            </div>

            {isFocused &&
            <div className={`Filter-select__dropdown scroller ${isFocused && 'isFocused'}`}>
                <ul className={'scroller select-dropdown__list'}>
                    {mock1.map(listItem => {
                        return <li
                            className={`filter-select__item ${includes(selectedItemsIds, listItem.id) 
                                ? 'selected' : ''}`}
                                   key={listItem.id}
                        onClick={() => {
                            onSelectItem(listItem)
                        }}
                        >
                            {listItem.title}
                        </li>
                    })}
                </ul>
            </div>
            }
        </div>
    );
}

export default FilterSelect;
