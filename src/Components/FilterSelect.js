import Tag from "./Tag";
import {ReactComponent as SearchIcon} from '../images/icons/search.svg'
import {ReactComponent as CrossIcon} from '../images/icons/cross-grey.svg'
import {ReactComponent as ArrowIcon} from '../images/icons/arrow.svg'
import {ReactComponent as ResetIcon} from '../images/icons/reset.svg'
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
    const [allFilterItems, setAllFilterItems] = useState([])
    const [filter, setFilter] = useState(type === 's_kind' ? 'Волейбол' : '')
    const [isLoading, setIsLoading] = useState(false)
    const [onlySelected, setOnlySelected] = useState(false)

    const [isFocused, setIsFocused] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [selectedBuf, setSelectedBuf] = useState([500, 1000, 3000, 5000])
    const MAX_SELECTED_COUNT = 5;

    const resetFilters = () => {
        if (!!selectedItems.length) {
            setSelectedItems([])
        }
    }

    useEffect(() => {
        if (!!allFilterItems?.length && type === 's_kind') {
            const initiallySelectedSportKind = allFilterItems?.filter(item => includes(model.s_kind, item.id))
            setSelectedItems(initiallySelectedSportKind)
        }
    }, [allFilterItems])

    useEffect(() => {
        if (model === null) {
            setSelectedItems([])
            setSelectedBuf([])
            setFilter('')
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
                    org_id: selectedItems.map(item => item.id),
                    org_name: selectedItems.map(item => item.title)
                })
                return
            case 'sz_type':
                setModel({
                    ...model,
                    sz_type: selectedItems.map(item => item.id),
                    sz_type_name: selectedItems.map(item => item.title)
                })
                return
            case 's_kind':
                setModel({
                    ...model,
                    s_kind: selectedItems.map(item => item.id),
                    s_kind_name: selectedItems.map(item => item.title)
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
        if (fetchItems) {
            fetchItems('').then(res => {
                const data = res?.data?.features?.map(item => ({
                    title: item.properties.name,
                    id: item.properties.id
                }))
                setAllFilterItems(data)
            })
        }
    }, [])

    useEffect(() => {
        getModelFunc()
    }, [selectedItems, selectedBuf])

    useEffect(() => {
        if (fetchItems) {
            setIsLoading(true)
            fetchItems(filter)
                .then(res => {
                    const data = res?.data?.features?.map(item => ({
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
        return selectedItems.map(item => item.id)
    }, [selectedItems])

    const onDeleteItem = useCallback((id) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id))
    }, [selectedItems])

    const onSelectItem = (item) => {
        if (!includes(selectedItems.map(item => item.id), item.id) && (checkbox || selectedItems.length < MAX_SELECTED_COUNT)) {
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
                <FilterItem title={'Шаговая (радиус - 500 м)'} setSelectedBuf={setSelectedBuf} selectedBuf={selectedBuf}
                            type={500}/>
                <FilterItem title={'Окружная (радиус - 3 км)'} setSelectedBuf={setSelectedBuf} selectedBuf={selectedBuf}
                            type={3000}/>
                <FilterItem title={'Районная (радиус - 1 км)'} setSelectedBuf={setSelectedBuf} selectedBuf={selectedBuf}
                            type={1000}/>
                <FilterItem title={'Городская (радиус - 5 км)'} setSelectedBuf={setSelectedBuf}
                            selectedBuf={selectedBuf} type={5000}/>
            </div>
        </div>
    }

    return (
        <div className={'Filter-select'}
             ref={filterRef}>
            <h3 className={'Filter-select__title'}>{title}</h3>
            <div className={'Filter-select__wrapper'}>
                <div className={`select__btn ${isFocused && 'isFocused'}`}
                     onClick={(e) => {
                         e.stopPropagation()
                         e.preventDefault()
                         setIsFocused(true)
                     }}>
                    <button className={'select__btn-arrow--btn'}
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsFocused(!isFocused)
                            }}>
                        <ArrowIcon
                            className={`select__btn-arrow ${isFocused ? 'isFocused' : ''}`}
                        />
                    </button>
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
                        <CrossIcon style={{cursor: 'pointer', right: 25, flexShrink: 0}}
                                   onClick={() => setFilter('')}
                        />
                        }
                    </label>
                </div>
                <ResetIcon className={`filter-reset-btn ${!!selectedItems.length && 'active'}`}
                           onClick={() => resetFilters()}/>
            </div>

            {isFocused
            && <div className={`Filter-select__dropdown scroller ${isFocused && 'isFocused'}`}>
                <ul className={'scroller select-dropdown__list'}>
                    {isLoading ? <Loader/>
                        : onlySelected ? allFilterItems?.map(listItem => {
                            debugger
                            if ((includes(selectedItemsIds, listItem.id))) {
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
                                    onChange={(e) => {
                                        e.stopPropagation()
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
