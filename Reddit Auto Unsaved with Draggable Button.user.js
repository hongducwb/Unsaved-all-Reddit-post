// ==UserScript==
// @name         Reddit Auto Unsaved with Draggable Button and Refresh Delay
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Draggable button to unsave all Reddit posts. Resumes automatically after refresh with delay.
// @author       hongducwb
// @match        https://old.reddit.com/user/*/saved
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentPageUrl;

    // Function to check if "there doesn't seem to be anything here" is present
    function checkEmptyPage() {
        return document.body.textContent.includes("there doesn't seem to be anything here");
    }

    // Function to click on all "unsave" links on the current page
    function saveAllUnsavedLinks() {
        const unsavedLinks = document.querySelectorAll('li.link-unsave-button.save-button a');

        if (unsavedLinks.length === 0) {
            console.log('No "unsave" links found on this page.');
            return false;
        }

        unsavedLinks.forEach(link => {
            if (link.innerText === 'unsave') {
                link.click();
            }
        });

        return true;
    }

    // Function to handle saving and navigating
    function saveAndNavigate() {
        if (checkEmptyPage()) {
            alert('Completed unsaving Reddit saved posts.');
            console.log('Stopping process: No more saved posts found.');
            localStorage.removeItem('unsaveInProgress'); // Stop auto restart
            return;
        }

        const hasUnsavedLinks = saveAllUnsavedLinks();

        if (!hasUnsavedLinks) {
            alert('Completed unsaving Reddit saved posts.');
            console.log('No "unsave" links on this page.');
            localStorage.removeItem('unsaveInProgress'); // Stop auto restart
            return;
        }

        // Delay before refreshing the page
        setTimeout(() => {
            window.location.reload(); // Reload the page to load more saved posts
        }, 5000); // 5-second delay
    }

    // Function to create draggable button
    function createDraggableButton() {
        const button = document.createElement('button');
        button.id = 'start-unsave-button';
        button.innerText = 'Start Delete Saved Reddit';
        button.style.position = 'fixed';
        button.style.top = localStorage.getItem('buttonTop') || '100px';
        button.style.left = localStorage.getItem('buttonLeft') || '100px';
        button.style.zIndex = '999999';
        button.style.padding = '10px';
        button.style.background = '#ff4500';
        button.style.color = '#fff';
        button.style.fontSize = '14px';
        button.style.border = 'none';
        button.style.cursor = 'move';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';

        document.body.appendChild(button);

        let isDragging = false;
        let offsetX, offsetY;

        // Mouse down event
        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - button.offsetLeft;
            offsetY = e.clientY - button.offsetTop;
            button.style.opacity = '0.7';
        });

        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;

                button.style.left = `${newX}px`;
                button.style.top = `${newY}px`;
            }
        });

        // Mouse up event
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                button.style.opacity = '1';

                // Save position to localStorage
                localStorage.setItem('buttonTop', button.style.top);
                localStorage.setItem('buttonLeft', button.style.left);
            }
        });

        // Click event to start the unsaving process
        button.addEventListener('click', () => {
            console.log('Started unsaving Reddit saved posts.');
            localStorage.setItem('unsaveInProgress', 'true'); // Mark process as in progress
            saveAndNavigate();
        });
    }

    // Automatically restart the unsaving process if it was running before the refresh
    function autoRestartIfInProgress() {
        if (localStorage.getItem('unsaveInProgress') === 'true') {
            console.log('Resuming unsaving Reddit saved posts after refresh...');
            setTimeout(() => saveAndNavigate(), 2000); // Add delay to allow button to load
        }
    }

    // Ensure the page is fully loaded before creating the button
    window.addEventListener('load', () => {
        createDraggableButton();
        autoRestartIfInProgress();
    });
})();
