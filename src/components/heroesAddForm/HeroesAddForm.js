import { useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { filterFetch} from '../heroesFilters/filtersSlice';
import { heroesAdd} from '../heroesList/heroesSlice'

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const {filters} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(filterFetch())
        // eslint-disable-next-line
    }, []);

    const addNewChar = ({ name, text, element }) => {
        const hero = {
            id: uuidv4(),
            name,
            description: text,
            element
        }
       
        request("http://localhost:3001/heroes", 'POST', JSON.stringify(hero))
            .then(dispatch(heroesAdd(hero)))

    }

    const options = filters.map(item => {
        if(item.id === 1){
            return 
        }
        return  <option key={item.id} value={item.name}>{item.label}</option>
    })

    return (
        <Formik
            initialValues={{
                name: '',
                text: '',
                element: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('This field is required'),
                text: Yup.string().required('This field is required'),
                element: Yup.string().required('This field is required'),
            })}
            onSubmit={async (char, {resetForm}) => {
                await addNewChar(char);
                resetForm(char, '');
            }}>
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field
                        required
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Как меня зовут?" />
                    <FormikErrorMessage component="div" className="callout-danger" name="name" />
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        required
                        name="text"
                        className="form-control"
                        id="text"
                        placeholder="Что я умею?"
                        as='textarea'
                        style={{ "height": '130px' }} />
                    <FormikErrorMessage component="div" className="error" name="text" />
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field
                        required
                        className="form-select"
                        id="element"
                        name="element"
                        as='select'>
                            <option>Я владею элементом...</option>
                            {options}
                
                    </Field>
                    <FormikErrorMessage component="div" className="error" name="element" />
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;