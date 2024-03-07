import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonDatetime,
  IonCheckbox,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonLabel,
  IonActionSheet,
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  createAnimation,
  IonModal
} from '@ionic/react';
import { getLogger } from '../core';
import { RouteComponentProps } from 'react-router';
import { BooksContext } from './BookProvider';
import { Book } from './Book';
import styles from './styles.module.css';
import { Photo, usePhotoGallery } from '../pages/usePhotoGallery';
import { trash, camera } from 'ionicons/icons';
import { MyMap } from '../pages/MyMap';

const log = getLogger('EditLogger');

interface EditProps extends RouteComponentProps<{
  id?: string;
}> {}

export const BookEdit: React.FC<EditProps> = ({ history, match }) => {
  const { books, updating, updateError, updateBook, deleteBook } = useContext(BooksContext);
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState(String(new Date(Date.now())));
  const [awarded, setAwarded] = useState(false);
  const [bookToUpdate, setBookToUpdate] = useState<Book>();
  const handleDateChange = (e: CustomEvent) => {
    const selectedDate = new Date(e.detail.value);
    setDate(selectedDate.toLocaleDateString()); };

  //pentru poze
  const {photos, takePhoto, deletePhoto} = usePhotoGallery();

  const [showStoredPictures, setShowStoredPictures] = useState<boolean>(false);
  const [webViewPath, setWebViewPath] = useState('');  
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();

  const photoStyle = { width: '30%', margin: "0 0 0 35%", border:'10px solid pink', borderRadius: '10px'};

  //pentru locatie
  const [currentLatitude, setCurrentLatitude] = useState<number | undefined>(undefined);
  const [currentLongitude, setCurrentLongitude] = useState<number | undefined>(undefined);  


  useEffect(() => {
    const routeId = match.params.id || '';
    console.log(routeId);
    //const idNumber = parseInt(routeId);
    const book = books?.find(it => it._id === routeId);
    setBookToUpdate(book);
    if(book){
      setTitle(book.title);
      setPages(book.pages.toString());
      setAuthor(book.author);
      setAwarded(book.awarded);
      setDate(book.date);
      //poza
      setWebViewPath(book.webViewPath || "");
      //locatie
      setCurrentLatitude(book.latitude || 0);
      setCurrentLongitude(book.longitude || 0);
    }
  }, [match.params.id, books]);

  const handleUpdate = useCallback(() => {
    log(`ULL ${currentLatitude} ${currentLongitude}`);
    const editedBook ={ ...bookToUpdate, title: title, pages: pages, author: author, awarded: awarded, date:date, webViewPath: webViewPath, latitude:currentLatitude, longitude:currentLongitude  };
    //console.log(duration);
    //console.log(editedBook);
    log(editedBook);
    console.log(updateBook);
    updateBook && updateBook(editedBook).then(() => history.goBack());
  }, [bookToUpdate, updateBook, title, pages, author, date, awarded, webViewPath, currentLatitude, currentLongitude, history]);


  async function handlePhotoChange() {
    const image = await takePhoto();
    //log(`vw ===== ${image}`);
    if (!image) {
        setWebViewPath('');
    } else {
        setWebViewPath(image);
    }
  } 


  //pentru animatie - modal override
  const modalEl = useRef<HTMLIonModalElement>(null);
  const closeModal = () => {
    modalEl.current?.dismiss();
  };

  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot!;

    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector('.modal-wrapper')!)
      .duration(1200)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 0.5, opacity: '0.7', transform: 'scale(1.3)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };
  const leaveAnimation = (baseEl: HTMLElement) => {
    return enterAnimation(baseEl).direction('reverse');
  };   
  //
  


  const handleDelete = useCallback(()=>{
    console.log(bookToUpdate?._id);
    deleteBook && deleteBook(bookToUpdate?._id!).then(()=> history.goBack());
  }, [bookToUpdate, deleteBook, title, pages, author, date, awarded, history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Book's Details</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleUpdate}>
              Update
            </IonButton>
            {/* <IonButton onClick={handleDelete}>
              Delete
            </IonButton> */}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput label="Title: " className={styles.customInput} placeholder="enter a new title" value={title} onIonInput={e => setTitle(prev => e.detail.value || '')} />
        <IonInput label="Author: " className={styles.customInput} placeholder="enter a new author" value={author} onIonInput={e => setAuthor(prev => e.detail.value || '')} />
        <IonInput label="NoPages: " className={styles.customInput} placeholder="enter a new number of pages" value={pages} onIonInput={e => e.detail.value ? setPages(prev => e.detail.value!) : setPages('') }/>
        <br></br>
        <IonLabel>Publication Date:</IonLabel>
        <IonDatetime presentation='date' display-format="MMM DD, YYYY" value={date} onIonChange={handleDateChange}></IonDatetime>
        <IonLabel>Awarded Book:  </IonLabel>
        <IonCheckbox checked={awarded} onIonChange={e => setAwarded(prev => e.detail.checked)}></IonCheckbox>
        <br/>
        <br/>
        <br/>
        
        {showStoredPictures &&
        <div>
            <IonGrid>
                <IonRow>
                    {photos.map((photo, index) => (
                        <IonCol size="6" key={index}>
                            <IonImg onClick={() => setPhotoToDelete(photo)}
                                    src={photo.webviewPath}/>
                        </IonCol>
                    ))}
                </IonRow>
            </IonGrid>
            <IonActionSheet
                isOpen={!!photoToDelete}
                buttons={[{
                    text: 'Delete',
                    role: 'destructive',
                    icon: trash,
                    handler: () => {
                        if (photoToDelete) {
                            deletePhoto(photoToDelete);
                            setPhotoToDelete(undefined);
                        }
                    }
                }, {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel'
                }]}
                onDidDismiss={() => setPhotoToDelete(undefined)}
            />
        </div>}

        {webViewPath && (<img style={photoStyle} onClick={handlePhotoChange} src={webViewPath} width={'200px'} height={'400px'}/>)}
        {!webViewPath && (
                    <IonFab vertical="bottom" horizontal="center" slot="fixed">
                        <IonFabButton onClick={handlePhotoChange}>
                            <IonIcon icon={camera}/>
                        </IonFabButton>
        </IonFab>)}
        
        <div>                                
            <MyMap
                lat={currentLatitude}
                lng={currentLongitude}
                onCoordsChanged={(elat, elng)=>{
                  log(`HAHA ${elat} ${elng}`)
                  setCurrentLatitude(elat);
                  setCurrentLongitude(elng);
                }}                      
            />            
          </div>

          <br/>
          <br/>
          <br/>
          
          <IonButton id="modal-trigger">What do you get when you cross a donkey with a computer?</IonButton>
          <IonModal trigger="modal-trigger" ref={modalEl} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="end">
                  <IonButton onClick={closeModal}>CLOSE</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
            <center>A SMART ASS!</center>
            <br/>
            <img src={"https://pbs.twimg.com/media/BWiXxK-CcAARQs7?format=jpg&name=large"} width={'900px'} height={'370px'}/>
            </IonContent>
          </IonModal>


        <IonLoading isOpen={updating} />
        {updateError && (
          <div className={styles.errorMessage}>{updateError.message || 'Failed to update item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
}
