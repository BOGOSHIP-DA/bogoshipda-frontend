/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import {
  makeSelectError,
  makeSelectLoading,
  makeSelectRepos,
} from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';


import axios from 'axios';
import StyledButton from 'components/Button/StyledButton';

const key = 'home';

const stateSelector = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export default function HomePage() {
  const { repos, username, loading, error } = useSelector(stateSelector);

  const dispatch = useDispatch();

  // Not gonna declare event types here. No need. any is fine
  const onChangeUsername = (evt: any) =>
    dispatch(changeUsername(evt.target.value));
  const onSubmitForm = (evt?: any) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
    if (!username) {
      return;
    }
    dispatch(loadRepos());
  };

  useInjectReducer({ key: key, reducer: reducer });
  useInjectSaga({ key: key, saga: saga });

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    if (username && username.trim().length > 0) {
      onSubmitForm();
    }

    Kakao.Auth.createLoginButton({
      container: '#kakaoLoginButton',
      scope: "talk_calendar",
      success: function (response) {

        alert(response.access_token);
        setCookie("kakao-access-token", response.access_token, 1);
        // $.ajax({
        //   type: "POST",
        //   url: "./login-query-kakao",
        //   data: { "access_token": response.access_token },
        //   dataType: "json",
        //   statusCode: {
        //     404: function (data) {

        //       setCookie("kakao-access-token", response.access_token, 1);
        //       location.href = "{{ url_for("user.register_form") }}";
        //     },
        //     200: function (data) {



        //     }
        //   }
        // }).done(function (data) {
        //   console.log(data);

        // })
      },
      fail: function (error) {
        console.log(error);
      },
    });
  }, []);

  const reposListProps = {
    loading: loading,
    error: error,
    repos: repos,
  };




  function setCookie(cookie_name, value, days) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정

    var cookie_value = escape(value) + ((days == null) ? '' : ';    expires=' + exdate.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
  }

  function getCookie(cookieName) {
    let cookieValue: string = "";
    if (document.cookie) {
      var array = document.cookie.split((escape(cookieName) + '='));
      if (array.length >= 2) {
        var arraySub = array[1].split(';');
        cookieValue = unescape(arraySub[0]);
      }
    }
    return cookieValue;
  }


  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>
      <div>
        <CenteredSection>
          <H2>
            Hello~~~
          </H2>
          <div id="kakaoLoginButton">

          </div>
          <br/>

          <StyledButton onClick={() => {
            let accessToken : string = getCookie("kakao-access-token");

            axios.get(`http://localhost:8283/kakao/getCalendar?accessToken=${accessToken}`).then((response) => {
              console.log(response);
            });
          }}>
            눌러주세요
          </StyledButton>
          <p id="token-result"></p>

        </CenteredSection>

      </div>
    </article >
  );
}
