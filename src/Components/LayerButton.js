import loader from '../images/icons/loader.gif'

const LayerButton = ({child})  => {
    return (
        <div className={'LayerButton'}>
          <button>
              {child}
          </button>
        </div>

    );
}

export default LayerButton;
