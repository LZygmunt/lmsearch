import React from 'react';

import "./scss/info.scss";

const Info = () => (
  <div id="info">
    <ul>
      <h2>Informacje odnośnie licencji</h2>
      <li>
        Obrazek: "To Win An Argument, You Need To Be Prepared And Have - Sad Linux Penguin Clipart" znajduje się
        pod tym <a
          href="https://www.pinclipart.com/pindetail/ihJbTTb_to-win-an-argument-you-need-to-be/"
          target="_blank"
          rel="noopener noreferrer"
        >linkiem</a>
      </li>
      <li>
        Artykuły i ich okładki zostały pobrane z <a
          href="https://linux-magazine.pl/"
          target="_blank"
          rel="noopener noreferrer"
        >linux-magazine.pl</a></li>
      <li>
        Ikony zostały pobrane ze strony <a
          href="https://fontawesome.com/"
          target="_blank"
          rel="noopener noreferrer"
        >Font Awesome</a></li>
    </ul>
    <h3><a href={ document.location.origin }>Powrót do aplikacji</a></h3>
  </div>
);

export default Info;
