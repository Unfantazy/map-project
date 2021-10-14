import {ReactComponent  as CrossIcon} from '../images/icons/cross.svg'


const Tag = ({ title, onDelete }) => {
    return (
        <div className={'Tag'}>
            <div className={'tag-title'}>{title}</div>
            <div className={'tag-delete'}
            onClick={onDelete}>
                <CrossIcon/>
            </div>
        </div>
    );
}

export default Tag;
