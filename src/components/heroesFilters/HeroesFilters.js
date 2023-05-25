import { useDispatch, useSelector } from 'react-redux';
import { changeFilter} from './filtersSlice';
import classNames from 'classnames'
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const {filters, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();

    const onFilter = (filter) => {
        dispatch(changeFilter(filter))
    }

    const filtersButtons = filters.map(item => {
       
        return  <button key={item.id} className={classNames({
            btn:true,
            [`${item.className}`]: true,
            active: item.name === activeFilter
        })}
        onClick={() => onFilter(item.name)}>{item.label}</button>
    })

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filtersButtons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;