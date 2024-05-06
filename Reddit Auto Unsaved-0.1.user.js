// ==UserScript==
// @name         Reddit Auto Unsaved
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically save all unsaved posts on a user's Reddit page and navigate to the original page after saving.
// @author       hongducwb
// @match        https://old.reddit.com/user/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    let currentPageUrl; // Variable to store the current page URL

    // Function to check if "noresults" element exists
    function checkNoResults() {
        const noResultsElement = document.querySelector('#noresults.error');
        return !!noResultsElement;
    }

    // Function to click on all "chưa lưu" links on the current page
    function saveAllUnsavedLinks() {
        const unsavedLinks = document.querySelectorAll('li.link-unsave-button.save-button a');

        if (unsavedLinks.length === 0) {
            console.log('No "unsave" links found. Stopping navigation.');
            return;
        }

        unsavedLinks.forEach(link => {
            if (link.innerText === 'unsave') {
                link.click();
            }
        });
    }

    // Function to save the current page URL
    function saveCurrentPageUrl() {
        currentPageUrl = window.location.href;
    }

    // Function to navigate to the saved page URL
    function navigateToSavedPageUrl() {
        if (currentPageUrl) {
            window.location.href = currentPageUrl;
        }
    }

    // Function to handle saving and navigating
    function saveAndNavigate() {
        saveCurrentPageUrl();
        if (checkNoResults()) {
            console.log('No results found. Stopping navigation.');
            return;
        }
        saveAllUnsavedLinks();
        setTimeout(navigateToSavedPageUrl, 3000); // Wait for 1 second before navigating to the original page
    }

    // Initial call to start the process
    saveAndNavigate();
})();


