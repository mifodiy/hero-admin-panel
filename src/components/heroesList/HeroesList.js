import { useHttp } from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {  createSelector } from "@reduxjs/toolkit";

import { heroesRemove , heroesFetch, selectAll} from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const heroesLoadingStatus  = useSelector(state => state.heroes.heroesLoadingStatus);

    const filteredHeroesSelector = createSelector(
        (state) => state.filters.activeFilter,
        selectAll,
        (filter, heroes) => {
            if (filter === 'all') {
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    );
    const { activeFilter } = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(heroesFetch())
        // eslint-disable-next-line
    }, []);

    const onDelete = (id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(dispatch(heroesRemove(id)))
            .catch()
    }

    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr
           // .filter(({ element }) => {
           //     return activeFilter === 'all' || element === activeFilter
          //  })
            .map(({ id, ...props }) => {
                return <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem key={id} id={id} onDelete={onDelete} {...props} />
                </CSSTransition>
            })
    }

    const elements = renderHeroesList(filteredHeroesSelector);
    return (
        <TransitionGroup component={'ul'}>
          {elements}
        </TransitionGroup>
    )
}

export default HeroesList;