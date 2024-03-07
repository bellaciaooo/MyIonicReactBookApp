import React, { memo } from "react";
import { IonItem, IonLabel } from "@ionic/react";
import { getLogger } from "../core";
import { Book } from "./Book";
import styles from "./styles.module.css";

interface PropsExtended extends Book {
    onEdit: (_id?: string) => void;
}

const photoStyle = { width: '30%', margin: "0 0 0 35%", border:'5px solid pink', borderRadius: '10px' };

const BookComponent: React.FC<PropsExtended> = ({_id, title, author, date, pages, awarded, isNotSaved, webViewPath, onEdit }) => (
    <IonItem style={{height:"35vh"}} color={isNotSaved ? "medium" : undefined} onClick={()=> onEdit(_id)}>
        <div className={styles.bookContainer}>
            <IonLabel className={styles.bookTitle}>
                <h1>{title}</h1>
            </IonLabel>
            <div className={styles.component}>
                {webViewPath && (<img style={photoStyle} src={webViewPath} width={'200px'} height={'50px'}/>)}
                <p>Author: {author} </p>
                <p>NoPages: {pages} </p>
                {date && (
                    <p>Publication Date: {new Date(date).toLocaleDateString()} </p>
                )}
                <p>Awarded:{awarded ? " Yes" : " No"}</p>
            </div>
        </div>
    </IonItem>
);

export default memo(BookComponent);
