import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLoading, IonPage, IonTitle, IonToolbar, createAnimation } from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';
import AnimationDemo from './AnimationDemo';

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  const handlePasswwordChange = useCallback((e: any) => setState({
    ...state,
    password: e.detail.value || ''
  }), [state]);
  const handleUsernameChange = useCallback((e: any) => setState({
    ...state,
    username: e.detail.value || ''
  }), [state]);
  const handleLogin = useCallback(() => {
    log('handleLogin...');
    login?.(username, password);
  }, [username, password]);
  log('render');
  useEffect(() => {
    if (isAuthenticated) {
      log('redirecting to home');
      history.push('/');
    }
  }, [isAuthenticated]);

  useEffect(simpleAnimation, []);
  useEffect(anotherSimpleAnimation,[]);

  return (
    <center>
    <IonPage>
      <IonHeader>
        <IonToolbar className='title'>
          <IonTitle>Login to Bella's Book App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
        <IonInput
          placeholder="Please type your username here"
          value={username}
          onIonChange={handleUsernameChange}/></IonItem>
        <IonItem>
        <IonInput
          placeholder="Please type your password here"
          type='password'
          value={password}
          onIonChange={handlePasswwordChange}/></IonItem>
        <IonLoading isOpen={isAuthenticating}/>
        {authenticationError && 
        <AnimationDemo
        allMandatory = "" 
        usernameMandatory = {undefined}
        passwordMandatory = {undefined} 
        authFailed = "You are not our user"
        wrong = "register or go away..."
        />
        }
        <IonButton className='login' onClick={handleLogin}>Login</IonButton>
      </IonContent>
    </IonPage>
    </center>
  );

  function simpleAnimation() {
    const el = document.querySelector('.title');
    if (el) {
        const animation = createAnimation()
            .addElement(el)
            .duration(1000)
            .direction('alternate')
            .iterations(Infinity)
            .keyframes([
                { offset: 0, marginLeft:"0px", background:"pink"},
                { offset: 0.5, marginLeft:"50px",background:"pink"},
                { offset: 1, marginLeft:"0px"}
            ]);
        animation.play();
    }        
  }

  function anotherSimpleAnimation() {
    const el = document.querySelector('.login');
    if (el) {
        const animation = createAnimation()
            .addElement(el)
            .duration(1000)
            .direction('alternate')
            .iterations(Infinity)
            .keyframes([
                { offset: 0, marginTop:"0px"},
                { offset: 0.5, marginTop:"15px"},
                { offset: 1, marginTop:"0px"}
            ]);
        animation.play();
    }        
  }
};

