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


const FilterSelect = (
    {
        title = 'Фильтр',
        onlyItems = false,
        fetchItems,
        checkbox = true,
        type,
        setModel,
        model
    }
) => {
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [onlySelected, setOnlySelected] = useState(false)

    const [isFocused, setIsFocused] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedBuf, setSelectedBuf] = useState([500, 1000, 3000, 5000])
    const MAX_SELECTED_COUNT = 5;

    useEffect(() => {
        if(model === null) {
            setSelectedItems([])
            setSelectedBuf([])
        }
    }, [model])

    const getModelFunc = () => {
        switch (type) {
            case 'obj_name':
                setModel({
                    ...model,
                    obj_name: selectedItems.map(item => item.title)
                })
                return
            case 'sz_name':
                setModel({
                    ...model,
                    sz_name: selectedItems.map(item => item.title)
                })
                return
            case 'org_id':
                setModel({
                    ...model,
                    org_id: selectedItems.map(item => item.id)
                })
                return
            case 'sz_type':
                setModel({
                    ...model,
                    sz_type: selectedItems.map(item => item.id)
                })
                return
            case 's_kind':
                setModel({
                    ...model,
                    s_kind: selectedItems.map(item => item.id)
                })
                return
            case 'buf':
                setModel({
                    ...model,
                    buf: selectedBuf
                })
                return
            default:
                return model
        }
    }

    useEffect(() => {
        getModelFunc()
    }, [selectedItems, selectedBuf])

    useEffect(() => {
        if (fetchItems) {
            setIsLoading(true)
            fetchItems(filter)
                .then(res => {
                    const data = res?.data?.features?.map(item => ({
                        idString: item.id,
                        title: item.properties.name,
                        id: item.properties.id
                    }))
                    setItems(data)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [filter])

    const filterRef = useRef(null)

    const selectedItemsIds = useMemo(() => {
        return selectedItems.map(item => item.idString)
    }, [selectedItems])

    const onDeleteItem = useCallback((id) => {
        setSelectedItems(selectedItems.filter(item => item.idString !== id))
    }, [selectedItems])

    const onSelectItem = (item) => {
        if (!includes(selectedItems.map(item => item.idString), item.idString) && selectedItems.length < MAX_SELECTED_COUNT) {
            setSelectedItems([...selectedItems, item])
        } else {
            setSelectedItems(selectedItems.filter(focusedItem => focusedItem.idString !== item.idString))
        }
    }

    useOnClickOutside(filterRef, () => {
        setIsFocused(false)
    })


    if (onlyItems) {
        return <div className={'Filter-select'}>
            <h3 className={'Filter-select__title'}>{title}</h3>
            <div className={'layers'}>
                <FilterItem title={'Шаговая (радиус - 500 м)'} setSelectedBuf={setSelectedBuf} selectedBuf={selectedBuf} type={500}/>
                <FilterItem title={'Окружная (радиус - 3 км)'} setSelectedBuf={setSelectedBuf} selectedBuf={selectedBuf} type={3000}/>
                <FilterItem title={'Районная (радиус - 1 км)'} setSelectedBuf={setSelectedBuf} selectedBuf={selectedBuf} type={1000}/>
                <FilterItem title={'Городская (радиус - 5 км)'} setSelectedBuf={setSelectedBuf} selectedBuf={selectedBuf} type={5000}/>
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
                                onDeleteItem(item.idString)
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
                            if ((includes(selectedItemsIds, listItem.idString))) {
                                return <li
                                    className={`filter-select__item ${(includes(selectedItemsIds, listItem.idString) && !checkbox)
                                        ? 'selected' : ''}`}
                                    key={listItem.idString}
                                    onClick={() => {
                                        onSelectItem(listItem)
                                    }}
                                >
                                    {checkbox && <CheckBox checked={includes(selectedItemsIds, listItem.idString)}/>}
                                    {listItem.title}
                                </li>
                            }
                        }) : !!items?.length ? items.map(listItem => {
                            return <li
                                className={`filter-select__item ${(includes(selectedItemsIds, listItem.idString) && !checkbox)
                                    ? 'selected' : ''}`}
                                key={listItem.idString}
                                onClick={() => {
                                    onSelectItem(listItem)
                                }}
                            >
                                {checkbox
                                && <CheckBox
                                    checked={includes(selectedItemsIds, listItem.idString)}
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
