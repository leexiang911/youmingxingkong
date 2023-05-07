// dom 查询辅助函数

/* 轮播图数据 */
const imgInfo = [
    {
        url: "https://lice-1255683938.file.myqcloud.com/demo_imgs/148032058.jpg",
        title: "可爱的猫猫"
    },
    {
        url: "https://lice-1255683938.file.myqcloud.com/demo_imgs/140032813.jpg",
        title: "优美的风景"
    },
    {
        url: "https://lice-1255683938.file.myqcloud.com/demo_imgs/136658645.jpg",
        title: "震撼人心的风景"
    },
    {
        url: "https://lice-1255683938.file.myqcloud.com/demo_imgs/308264214.jpg",
        title: "小女孩"
    },
    {
        url: "https://lice-1255683938.file.myqcloud.com/demo_imgs/168268488.jpg",
        title: "呵呵呵呵"
    },
    {
        url: "https://lice-1255683938.file.myqcloud.com/demo_imgs/157992910.jpg",
        title: "大狮子"
    },
    {
        url: "https://lice-1255683938.file.myqcloud.com/%E5%9B%BD%E6%97%97/TaiWan.svg",
        title: "中国国旗"
    }
];




function $(selector) {
    return document.querySelector(selector);
}

/**
 * 
 * @param {*} selector 
 * @returns DOM
 */
function $$(selector) {
    return document.querySelectorAll(selector);
}

let jumbotron = $(".jumbotron");//获取巨幕
let thumbnaiUl = $(".thumbnail>ul");
let currnetIndex = 0;// 当前图片的下标
let liWidth = 160;//缩略图宽度
let canBeclick = true;

/* 初始哈函数 */
function init() {
    let jumbotronContent = '';//拼接巨幕图的内容
    let thumbnaiUlContent = '';//拼接缩略图的内容
    for (let i = 0; i < imgInfo.length; i++) {
        // 需要做一下判断，如果是当前的图片，样式会有些许不同
        if (i === currnetIndex) {// 说明是当前图片
            // 拼接巨幕图片
            jumbotronContent +=
                `
                <div class="jumbotronImage"
                 data-id="${i}" 
                 style="background:url(${imgInfo[i].url}) no-repeat center/cover"                 
                > 
                    <span>${imgInfo[i].title}</span>
                </div>
                <div class='coverBg'></div>
                `;

            // 拼接缩略图,如果是当前图片，就有一个背景137
            thumbnaiUlContent +=
                `
                <li data-id="${i}" style="background-color:rgb(137,137,137);" >
                    <div data-id="${i}" style="background:url(${imgInfo[i].url}) no-repeat;background-size:cover;"></div>
                </li>
            `
        } else {
            // 不是当前图片
            jumbotronContent +=
                `
            <div class="jumbotronImage"
             data-id="${i}" 
             style="background:url(${imgInfo[i].url}) no-repeat center/cover;opacity:0;"> 
                <span>${imgInfo[i].title}</span>
                <div class='coverBg'></div>
            </div>
            
            `;
            // 拼接缩略图，不是当前图片，不需要单独设置颜色，使用css设置的背景颜色
            thumbnaiUlContent +=
                `
                <li data-id="${i}">
                    <div data-id="${i}" style="background:url(${imgInfo[i].url}) no-repeat;background-size:cover;"></div>
                </li>
                `
        }
    }

    jumbotron.innerHTML += jumbotronContent;
    thumbnaiUl.innerHTML += thumbnaiUlContent;
}

/* 根据图片索引下标，更新巨幕图内容 */
function updateJumbotron() {
    console.log(currnetIndex, 9999)
    /* 更新巨幕图片 */
    let jumbotronImageCollection = $$(".jumbotronImage");
    for (let i = 0; i < jumbotronImageCollection.length; i++) {
        if (i === currnetIndex) {
            // 当前图片不透明
            jumbotronImageCollection[i].style.opacity = 1;
        } else {
            // 不是当前图片，透明
            jumbotronImageCollection[i].style.opacity = 0;
        }
    }
    /* 更新缩略图的背景框 */

    let thumbnailCollection = $$(".thumbnail>ul>li");
    for (let i = 0; i < thumbnailCollection.length; i++) {
        // console.log(i)
        if (thumbnailCollection[i].dataset.id == currnetIndex) {
            console.log(i)
            /* 说明是当前图片没有背景颜色 */
            thumbnailCollection[i].style.backgroundColor = "rgb(137, 137, 137)";
        } else {
            thumbnailCollection[i].style.backgroundColor = "rgb(226, 226, 226)";
        }
    }

    /* 更新右下加图片索引 */

    $(".currentImage").innerHTML = currnetIndex + 1;
}

/* 绑定事件 */
function bindEvent() {
    // 先做左右箭头的点击
    jumbotron.onclick = function (e) {
        if (e.target.id === "leftArrow" && canBeclick) {//说明用户点击了左箭头
            canBeclick = false
            currnetIndex--;
            if (currnetIndex < 0) {
                currnetIndex = imgInfo.length - 1;
            }
            // 更新巨幕图
            updateJumbotron();

            // 更新缩略图，核心思路，最后一张移动到第一张，然后在平移出来
            /* 删除最后一个li的同时保存最后一个li */
            let listLi = thumbnaiUl.removeChild(thumbnaiUl.children[thumbnaiUl.children.length - 1]);
            thumbnaiUl.insertBefore(listLi, thumbnaiUl.children[0])
            thumbnaiUl.style.transform = `translateX(${-liWidth}px)`
            setTimeout(() => {
                thumbnaiUl.style.transition = '1s';
                thumbnaiUl.style.transform = `translateX(0px)`
                thumbnaiUl.ontransitionend = function () {
                    thumbnaiUl.style.transition = null;
                    canBeclick = true;
                }
            }, 0)
        }

        if (e.target.id === "rightArrow" && canBeclick) {//用户点击了右箭头
            canBeclick = false
            /* 切换分两个部分，上面的巨幕图和下面的缩略图 */
            // 1.核心思想，更新currentIndex
            // 然后将所有图片设置为透明，当前图片不透明
            currnetIndex++;
            if (currnetIndex > imgInfo.length - 1) {
                currnetIndex = 0;
            }
            // 更新巨幕图片
            updateJumbotron();

            // 更新下面缩略图，核心思想，第一张移动到最后
            thumbnaiUl.style.transition = '1s'
            thumbnaiUl.style.transform = `translateX(${-liWidth}px)`
            thumbnaiUl.ontransitionend = function () {
                let firstLi = thumbnaiUl.removeChild(thumbnaiUl.children[0])
                thumbnaiUl.appendChild(firstLi);
                thumbnaiUl.style.transition = '';
                thumbnaiUl.style.transform = `translateX(0px)`
                canBeclick = true;
            }
        }
    }
    thumbnaiUl.onclick = function (e) {
        console.log(e.target)
        currnetIndex = Number(e.target.getAttribute("data-id")) || 0
        updateJumbotron();
        // console.log(currnetIndex)

        thumbnaiUl.style.transition = '1s'
        thumbnaiUl.style.transform = `translateX(${-liWidth}px)`
        thumbnaiUl.ontransitionend = function () {
            let firstLi = thumbnaiUl.removeChild(thumbnaiUl.children[0])
            thumbnaiUl.appendChild(firstLi);
            thumbnaiUl.style.transition = '';
            thumbnaiUl.style.transform = `translateX(0px)`
            canBeclick = true;
        }

    }
}

/* 程序主函数 */
function main() {
    init();// 1初始化把dom补充完整
    bindEvent()
}

main()