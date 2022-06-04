import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

function StarRating({ rating }) {
  const intRating = Math.floor(rating)
  const fracRating = rating - intRating
  return (
    [...Array(5)].map((_, index) => {
      let extraStyles = null;
      if (index < intRating) {
        extraStyles = styles.starOn
      } else if (index === intRating && fracRating > 0) {
        extraStyles = styles.starHalf
      }

      return <div className={`${styles.starRating} ${extraStyles}`} key={index} />
    })
  )
}

function ImageWithFallbacks({ src, fallbacks, alt, ...rest }) {
  const [currentImg, setCurrentImg] = useState(src)
  const [currentFallback, setCurrentFallback] = useState(1);

  function handleTryAnotherImage() {
    if (currentFallback >= fallbacks.length) {
      setCurrentImg("/favicon.ico")
      return
    }
    const newSrc = fallbacks[currentFallback]
    setCurrentImg(newSrc)
    setCurrentFallback(currentFallback + 1)
  }

  return (
    <Image src={currentImg} onError={() => handleTryAnotherImage()} alt={alt} {...rest} />
  )
}

function ThumbnailRow({ data, activeItem }) {
  return (
    [...Array(5)].map((_, index) => {
      let newIndex = activeItem + index - 2
      if (newIndex < 0) {
        newIndex += data.length
      } else if (newIndex >= data.length) {
        newIndex -= data.length
      }
      return (
        <div className={`${styles.thumbnail} ${newIndex === activeItem && styles.activeThumbnail}`} key={newIndex}>
          <ImageWithFallbacks src={data[newIndex].image} fallbacks={data[newIndex].images} width={50} height={50} alt={`Image ${newIndex}`} />
        </div>
      )
    }))

}

function Carousel({ data }) {
  const [activeItem, setActiveItem] = useState(0);

  function handleNextSlide(isIncrease) {
    let newActiveItem = activeItem
    if (isIncrease) {
      if (activeItem >= data.length - 1) {
        newActiveItem = 0
      } else {
        newActiveItem += 1
      }
    } else {
      if (activeItem <= 0) {
        newActiveItem = data.length - 1
      } else {
        newActiveItem -= 1
      }
    }
    setActiveItem(newActiveItem)
  }

  return (
    <div className={styles.grid}>
      <div className={styles.carouselImageContainer}>
        {data.map((item, index) => (
          <div className={`${styles.inner} ${index === activeItem ? styles.activeItem : styles.inactiveItems}`} key={index}>
            <ImageWithFallbacks src={item.image} fallbacks={item.images} width={200} height={200} alt={`Image ${index}`} />
          </div>
        ))}
        <div className={styles.carouselButtons}>
          <button type="button" className={styles.individualButton} onClick={() => handleNextSlide(false)}>🡐</button>
          <div>{activeItem + 1} / {data.length}</div>
          <button type="button" className={styles.individualButton} onClick={() => handleNextSlide(true)}>🡒</button>
        </div>
        <div className={styles.thumbnailRow}>
          <ThumbnailRow data={data} activeItem={activeItem} />
        </div>
      </div>
      <div className={styles.textBox}>
        <div>
          <h3>{data[activeItem].name}</h3>
          <div className={styles.reviews}>
            <StarRating rating={data[activeItem].rating} />
            <div className={styles.reviewText}>({data[activeItem].reviewCount} reviews)</div>
          </div>
          <h2>{data[activeItem].price}</h2>
        </div>
        <div className={styles.buttonRow}>
          <button type="button" className={styles.addToCart}>Add to Cart</button>
          <button type="button" className={styles.buyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  )
}

function Home({ data }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>MIFX Interview Test - Evan Robinson</title>
        <meta name="description" content="Job interview test for MIFX created by Evan Robinson" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Carousel data={data} />
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const authRes = await fetch('https://fe.dev.dxtr.asia/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "evanlouisr@gmail.com",
      password: "Test123.",
    })
  })
  const { token } = await authRes.json()
  const res = await fetch('https://fe.dev.dxtr.asia/api/products', {
    method: 'GET',
    headers: { "Authorization": `Bearer ${token}` }
  })
  const data = await res.json()

  return {
    props: { data }
  }
}


export default Home