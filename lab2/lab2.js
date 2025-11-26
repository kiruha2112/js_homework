const likeBtn = document.getElementById('like-btn');
  const likeIcon = document.getElementById('like-icon');
  const likeText = document.getElementById('like-text');

  likeBtn.addEventListener('click', () => {
    const isActive = likeBtn.classList.toggle('btn-primary');
    likeBtn.classList.toggle('btn-outline-primary');

    likeBtn.setAttribute('aria-pressed', isActive);
    likeIcon.textContent = isActive ? '❤️' : '👍';
    likeText.textContent = isActive ? 'Вы лайкнули' : 'Нравится';
  });

  const reactionLike = document.getElementById('reaction-like');
  const reactionDislike = document.getElementById('reaction-dislike');

  const reactionLikeIcon = document.getElementById('reaction-like-icon');
  const reactionLikeText = document.getElementById('reaction-like-text');

  const reactionDislikeIcon = document.getElementById('reaction-dislike-icon');
  const reactionDislikeText = document.getElementById('reaction-dislike-text');

  function handleReaction(clickedBtn, otherBtn, clickedIcon, clickedText, otherIcon, otherText, activeClass, activeIcon, activeText, inactiveIcon, inactiveText) {
    const isActive = clickedBtn.classList.contains(activeClass);

    if (isActive) {
      clickedBtn.classList.remove(activeClass);
      clickedBtn.classList.add(clickedBtn === reactionLike ? 'btn-outline-success' : 'btn-outline-danger');
      clickedBtn.setAttribute('aria-pressed', 'false');
      clickedIcon.textContent = inactiveIcon;
      clickedText.textContent = inactiveText;
    } else {
      clickedBtn.classList.add(activeClass);
      clickedBtn.classList.remove(clickedBtn === reactionLike ? 'btn-outline-success' : 'btn-outline-danger');
      clickedBtn.setAttribute('aria-pressed', 'true');
      clickedIcon.textContent = activeIcon;
      clickedText.textContent = activeText;

      otherBtn.classList.remove(otherBtn === reactionLike ? 'btn-success' : 'btn-danger');
      otherBtn.classList.add(otherBtn === reactionLike ? 'btn-outline-success' : 'btn-outline-danger');
      otherBtn.setAttribute('aria-pressed', 'false');
      otherIcon.textContent = otherBtn === reactionLike ? '👍' : '👎';
      otherText.textContent = otherBtn === reactionLike ? 'Нравится' : 'Не нравится';
    }
  }

  reactionLike.addEventListener('click', () => {
    handleReaction(
      reactionLike, reactionDislike, 
      reactionLikeIcon, reactionLikeText, 
      reactionDislikeIcon, reactionDislikeText, 
      'btn-success', '❤️', 'Вы лайкнули', '👍', 'Нравится'
    );
  });

  reactionDislike.addEventListener('click', () => {
    handleReaction(
      reactionDislike, reactionLike, 
      reactionDislikeIcon, reactionDislikeText, 
      reactionLikeIcon, reactionLikeText, 
      'btn-danger', '💔', 'Вы не лайкнули', '👎', 'Не нравится'
    );
  });

  const cartCount = document.getElementById('cart-count');
  let count = 0;

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      count++;
      cartCount.textContent = count;
    });
  });

  const numbers = Array.from({length: 10}, () => Math.floor(Math.random() * 100));
  const originalNumbers = [...numbers];

  const list = document.getElementById('number-list');

  function renderList(arr) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    arr.forEach(num => {
      const li = document.createElement('li');
      li.textContent = num;
      li.className = 'list-group-item';
      list.appendChild(li);
    });
  }

  renderList(numbers);

  document.getElementById('asc-btn').addEventListener('click', () => {
    renderList([...numbers].sort((a,b) => a-b));
  });

  document.getElementById('desc-btn').addEventListener('click', () => {
    renderList([...numbers].sort((a,b) => b-a));
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    renderList(originalNumbers);
  });

  const output = document.getElementById('output');

  document.addEventListener('pointerdown', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const element = event.target.tagName.toLowerCase();
    output.textContent = `X: ${x}, Y: ${y} - ${element}`;
  });