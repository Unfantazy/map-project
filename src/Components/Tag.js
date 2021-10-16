import {ReactComponent as CrossIcon} from '../images/icons/cross.svg'


const Tag = ({title, onDelete}) => {
    return (
        <button className={'Tag'}>
            <div className={'tag-title'}>{title}</div>
            <div className={'tag-delete'}
                 onClick={onDelete}>
                <CrossIcon/>
            </div>
        </button>
    );
}

export default Tag;
