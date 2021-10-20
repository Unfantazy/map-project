import Tag from "./Tag";
import {ReactComponent as SearchIcon} from '../images/icons/search.svg'
import {ReactComponent as CrossIcon} from '../images/icons/cross-grey.svg'
import {ReactComponent as ArrowIcon} from '../images/icons/arrow.svg'
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {includes} from "lodash";
import {useOnClickOutside} from "../customHooks/useOnClickOutside";
import FilterItem from "./FilterItem";
import Loader from "./Loader";
import CheckBox from "./CheckBox";


const FilterSelect = ({title = 'Фильтр', onlyItems = false, fetchItems, checkbox = true}) => {

    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [onlySelected, setOnlySelected] = useState(false)

    useEffect(async () => {
        if (fetchItems) {
            setIsLoading(true)
            await fetchItems(filter)
                .then(res => {
                    const data = res?.data?.features?.map(item => ({id: item.id, title: item.properties.name}))
                    setItems(data)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [filter])

    const [isFocused, setIsFocused] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])


    const filterRef = useRef(null)

    const selectedItemsIds = useMemo(() => {
        return selectedItems.map(item => item.id)
    }, [selectedItems])

    const onDeleteItem = useCallback((id) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id))
    }, [selectedItems])

    const onSelectItem = (item) => {
        if (!includes(selectedItems.map(item => item.id), item.id)) {
            setSelectedItems([...selectedItems, item])
        } else {
            setSelectedItems(selectedItems.filter(focusedItem => focusedItem.id !== item.id))
        }
    }

    useOnClickOutside(filterRef, () => {
        setIsFocused(false)
    })

    if (onlyItems) {
        return <div className={'Filter-select'}>
            <h3 className={'Filter-select__title'}>{title}</h3>
            <div className={'layers'}>
                <FilterItem name={'Шаговая (радиус - 500 м)'}/>
                <FilterItem name={'Окружная (радиус - 3 км)'}/>
                <FilterItem name={'Районная (радиус - 1 км)'}/>
                <FilterItem name={'Городская (радиус - 5 км)'}/>
            </div>
        </div>
    }

    return (
        <div className={'Filter-select'}
             ref={filterRef}>
            <h3 className={'Filter-select__title'}>{title}</h3>
            <div className={`select__btn ${isFocused && 'isFocused'}`}
                 onClick={(e) => {
                     e.stopPropagation()
                     e.preventDefault()
                     setIsFocused(true)
                 }}>
                <ArrowIcon
                    className={`select__btn-arrow ${isFocused ? 'isFocused' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsFocused(!isFocused)
                    }}
                />
                <div className={`tags-container scroller`}>
                    {!checkbox && selectedItems.map(item => {
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
                    {checkbox && <div className={`select__chosen ${onlySelected ? 'selected' : ''}`}
                    onClick={() => {
                        setOnlySelected(!onlySelected)
                    }}
                    >Выбрано ({selectedItems.length})</div>}
                    <SearchIcon style={{flexShrink: 0}}/>
                    <input
                        type="text"
                        placeholder={'Введите название'}
                        className={'select-input'}
                        value={filter}
                        onChange={(e) => setFilter(e.currentTarget.value)}
                    />
                    {filter &&
                    <CrossIcon style={{cursor: 'pointer', right: 12, flexShrink: 0}}
                               onClick={() => setFilter('')}
                    />
                    }
                </label>
            </div>

            {isFocused
            && <div className={`Filter-select__dropdown scroller ${isFocused && 'isFocused'}`}>
                <ul className={'scroller select-dropdown__list'}>
                    {isLoading ? <Loader/>
                        : onlySelected ? items?.map(listItem => {
                            if((includes(selectedItemsIds, listItem.id))) {
                                return <li
                                    className={`filter-select__item ${(includes(selectedItemsIds, listItem.id) && !checkbox)
                                        ? 'selected' : ''}`}
                                    key={listItem.id}
                                    onClick={() => {
                                        onSelectItem(listItem)
                                    }}
                                >
                                    {checkbox && <CheckBox checked={includes(selectedItemsIds, listItem.id)}/>}
                                    {listItem.title}
                                </li>
                            }
                        }) : !!items?.length ? items.map(listItem => {
                            return <li
                                className={`filter-select__item ${(includes(selectedItemsIds, listItem.id) && !checkbox)
                                    ? 'selected' : ''}`}
                                key={listItem.id}
                                onClick={() => {
                                    onSelectItem(listItem)
                                }}
                            >
                                {checkbox
                                && <CheckBox
                                    checked={includes(selectedItemsIds, listItem.id)}
                                    onChange={() => {
                                        onSelectItem(listItem)
                                    }}
                                />}
                                {listItem.title}
                            </li>
                        }) : <div className={'nothing-found'}>По вашему запросу ничего не найдено</div>}
                </ul>
            </div>
            }
        </div>
    );
}

export default FilterSelect;
