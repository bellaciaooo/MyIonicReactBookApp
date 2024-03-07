import React from 'react';
import { useAppState } from "./useAppState";
import { useNetwork } from "./useNetwork";
import { IonContent, IonItem, IonLabel } from "@ionic/react";


export const NetworkState: React.FC = () => {
    const { appState } = useAppState();
    const {networkStatus} = useNetwork();
    
    return (
      networkStatus.connected ? 
        <IonLabel style={{ marginRight: '5px', marginLeft: '5px', color:"#32a852"}} slot="end">
            Online 😄
        </IonLabel> :
        <IonLabel style={{ marginRight: '5px' , color:"#b5143f"}} slot="end">
            Offline ♿
        </IonLabel>
    );
}