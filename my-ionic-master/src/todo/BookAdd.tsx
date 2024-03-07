import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonCheckbox,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonLabel,
  IonDatetime,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { getLogger } from '../core';
import { RouteComponentProps } from 'react-router';
import { BooksContext } from './BookProvider';
import { Book } from './Book';
import styles from './styles.module.css';

const log = getLogger('SaveLogger');

interface BookEditProps extends RouteComponentProps<{
  id?: string;
}> {}

export const BookAdd: React.FC<BookEditProps> = ({ history, match }) => {
  const { books, updating, updateError, addBook } = useContext(BooksContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState(String(new Date(Date.now())));
  const [pages, setPages] = useState('');
  const [awarded, setAwarded] = useState(false);
  const handleDateChange = (e: CustomEvent) => {
    const selectedDate = new Date(e.detail.value);
    setDate(selectedDate.toLocaleDateString()); };
  const [option, setOption] = useState(true);
  const [bookToUpdate, setBookToUpdate] = useState<Book>();

  const handleAdd = useCallback(() => {
    const editedBook ={ ...bookToUpdate, title: title, author: author, pages: pages, date: date, awarded: option };
    //console.log(duration);
    //console.log(editedBook);
    log(editedBook);
    console.log(updateError);
    addBook && addBook(editedBook).then(() => history.goBack());
  }, [bookToUpdate, addBook, title, author, date, pages, option, history]);

  const dateChanged = (value: any) => {
    let formattedDate = value;
    console.log(formattedDate);
    setDate(formattedDate);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleAdd}>
              Add
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput label="Title:" className={styles.customInput} placeholder="please enter a title" value={title} onIonInput={e => setTitle(prev => e.detail.value || '')} />
        <IonInput label="Author:" className={styles.customInput} placeholder="please enter an author" value={author} onIonInput={e => setAuthor(prev => e.detail.value || '')} />
        <IonInput label="NoPages:" className={styles.customInput} placeholder="please enter the number of pages" value={pages} onIonInput={e => e.detail.value ? setPages(prev => e.detail.value!) : setPages('') }/>
        <br></br>
        <IonLabel>Publication Date:</IonLabel>
        <IonDatetime presentation='date' display-format="MMM DD, YYYY" value={date} onIonChange={handleDateChange}></IonDatetime>
        <IonLabel>Awarded book: </IonLabel>
        <IonCheckbox checked={awarded} onIonChange={e => setAwarded(prev => e.detail.checked)}></IonCheckbox>
        <IonLoading isOpen={updating} />
        {updateError && (
          <div className={styles.errorMessage}>{updateError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
}
