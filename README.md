# ๐โโ๏ธ Runnect_Server

[32st SOPT APPJAM] Server team repository of Runnect
### ์ ๊ณผ ์ ์ผ๋ก, ์ฝ์ค์ ์ฝ์ค๋ก ์ฐ๊ฒฐ๋๋ ๋์ ๋์ ๋ฌ๋ ๊ฒฝํ
![ํ์ง](https://user-images.githubusercontent.com/88873302/212262655-0f14bae8-79d9-4aff-b52a-993694727a6a.jpg)
</br>
![A333](https://user-images.githubusercontent.com/88873302/212286726-608ec06a-5631-4aaf-ae7f-bf711a4ef234.jpg)

</aside>
<hr>
</br>

# โ ์๋น์ค ํต์ฌ ๊ธฐ๋ฅ
### 1. ์ฝ์ค ๊ทธ๋ฆฌ๊ธฐ
> ์ฝ์ค ๊ทธ๋ฆฌ๊ธฐ๋ก ๋ฌ๋ฆฌ๊ธฐ ์  ๋ชฉํ๋ฅผ ์ค์ ํ๊ณ  ์ค์๊ฐ ํธ๋ํน์ผ๋ก ์ฝ์ค๋ฅด ๋ฐ๋ผ ์ ๋ฌ๋ฆฌ๊ณ  ์๋์ง ํ์ธํฉ๋๋ค.
### 2. ์ฝ์ค ๋ฐ๊ฒฌ
> ์ฝ์ค ๋ฐ๊ฒฌ์ ํตํด ๋์๊ฒ ๋ง๋ ์ฝ์ค๋ฅผ ์ถ์ฒ ๋ฐ๊ฑฐ๋ ๋ค๋ฅธ ์ ์ ๊ฐ ๊ณต์ ํ ์ฝ์ค๋ฅผ ๊ฒ์ํ๊ณ  ์คํฌ๋ฉํฉ๋๋ค. ์ฝ์ค๋ฅผ ์ง์  ์๋ก๋ํ  ์ ๋ ์์ต๋๋ค.
### 3. ์ฝ์ค ๋ณด๊ดํจ
> ์ฝ์ค ๋ณด๊ดํจ์์ ๋ด๊ฐ ๊ทธ๋ฆฐ ์ฝ์ค์ ์คํฌ๋ฉ ์ฝ์ค๋ฅผ ๊ด๋ฆฌํฉ๋๋ค.
### 4. ๋ง์ดํ์ด์ง
> ๋ง์ดํ์ด์ง์์ ํ๋กํ๊ณผ ํ๋ ๊ธฐ๋ก, ์๋ก๋ํ ์ฝ์ค๋ฅผ ํ์ธํ๊ณ  ๋ชฉํ ๋ณด์์ผ๋ก ๋๊ธฐ๋ฅผ ๊ฐํํฉ๋๋ค.

</aside>
<hr>
</br>

# ๐จ Dependencies Module ( package.json )
```json
{
  "name": "Runnect_Server",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/Runnect/Runnect_Server.git",
  "author": "YuSuhwa-ve <dhfhfkzjxms@sookmyung.ac.kr>",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc && node dist",
    "db:pull": "npx prisma db pull",
    "db:push": "npx prisma db push",
    "generate": "npx prisma generate",
    "prepare": "chmod ug+x .husky/* && husky install",
    "greet": "hello husky!",
    "test": "mocha ./test/ -r ts-node/register"
  },
  "dependencies": {
    "@prisma/client": "^4.8.0",
    "aws-sdk": "^2.1281.0",
    "bcryptjs": "^2.4.3",
    "dayjs": "^1.11.7",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^6.14.2",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "multer-s3": "^3.0.1",
    "prisma": "^4.8.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/chai": "^4.3.4",
    "@types/express": "^4.17.15",
    "@types/express-validator": "^3.0.0",
    "@types/jsonwebtoken": "^8.5.9",
    "@types/mocha": "^10.0.1",
    "@types/multer": "^1.4.7",
    "@types/multer-s3": "^3.0.0",
    "@types/node": "^18.11.17",
    "@types/supertest": "^2.0.12",
    "chai": "^4.3.7",
    "commitizen": "^4.2.6",
    "cz-conventional-changelog": "3.3.0",
    "cz-emoji-conventional": "^1.0.1",
    "husky": "^8.0.0",
    "mocha": "^10.2.0",
    "nodemon": "^2.0.20",
    "supertest": "^6.3.3",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.4"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-emoji-conventional"
    }
  }
}

```

</aside>
<hr>
</br>

# ๐  server architecture

![์๋ฒ์ํคํ์ณ](https://user-images.githubusercontent.com/88873302/212261508-c8a41c73-fb9a-4694-8c65-24cee545f311.jpg)
</aside>
<hr>
</br>

# ๐ Folder ๊ตฌ์กฐ

```jsx
๐ src
|_ ๐ config
|_ ๐ constant
|_ ๐ controller
|_ ๐ interface
|_ ๐ middleware
|_ ๐ module
|_ ๐ prisma
|_ ๐ router
|_ ๐ service
|_ index.ts

๐ test
```



</aside>
<hr>
</br>

# ๐ฝย DB ERD



![image](https://user-images.githubusercontent.com/65851554/210541836-a70d8853-46e3-4103-81c1-258006343b7e.png)


</aside>
<hr>
</br>

# ๐ API(+ Non - API) Docs

[Runnect Server API(+ Non - API) Docs](https://meowing-orange-9b6.notion.site/Runnect-Server-API-Non-API-Docs-d22169bc1df84bf8871e59781d03be2b)
![image](https://user-images.githubusercontent.com/88873302/212285411-c1f1aae2-78c7-4a92-bd7b-907a9c31ac03.png)
</aside>
<hr>
</br>


# ๐โโ๏ธ ์ญํ ๋ถ๋ด & ๊ตฌํ ์ง์ฒ๋

|๋ด๋น์|๋ด๋น ๋ด์ฉ|๊ตฌํ ์ง์ฒ๋|
|:---|:---|:---|
|์ ์ํ|EC2, publicCourse & stamp ๊ด๋ จ api|100%|
|์ ์ ํฌ|RDS, course & user ๊ด๋ จ api|100%|
|๋ฐ์๋ฆฐ|S3, record & scrap ๊ด๋ จ api|100%|

</aside>
<hr>
</br>

# ๐ฃ๏ธ๏ธ ์ปจ๋ฒค์

> ๐ก **๋๋ฃ๋ค๊ณผ ๋งํฌ๋ฅผ ํต์ผํ๊ธฐ ์ํด ์ปจ๋ฒค์์ ์ง์ ํฉ๋๋ค.**
> ์คํฉ์ง์กธ์ ์ฝ๋๊ฐ ์๋, **ํ ์ฌ๋์ด ์ง  ๊ฒ๊ฐ์ ์ฝ๋**๋ฅผ ์์ฑํ๋ ๊ฒ์ด ์ถํ ์ ์ง๋ณด์๋ ํ์์์ ๋์์ด ๋ฉ๋๋ค. ๋ด๊ฐ ์ฝ๋๋ฅผ ์๊ฐํ๋ฉด์ ์งค ์ ์๋๋ก ํด์ฃผ๋ ๋ฃฐ์ด๋ผ๊ณ  ์๊ฐํด๋ ์ข์ต๋๋ค!

## ๐ฉโ๐ปย Coding Conventions

<details>
<summary>๋ช๋ช๊ท์น(Naming Conventions)</summary>
<div markdown="1">

1. ์ด๋ฆ์ผ๋ก๋ถํฐ ์๋๊ฐ ์ฝํ์ง ์ ์๊ฒ ์ด๋ค.

- ex)

  ```jsx
  // bad
  function q() {
    // ...stuff...
  }

  // good
  function query() {
    // ..stuff..
  }
  ```

2. ์ค๋ธ์ ํธ, ํจ์, ๊ทธ๋ฆฌ๊ณ  ์ธ์คํด์ค์๋ `camelCase`๋ฅผ ์ฌ์ฉํ๋ค.

- ex)

  ```jsx
  // bad
  const OBJEcttsssss = {};
  const this_is_my_object = {};
  function c() {}

  // good
  const thisIsMyObject = {};
  function thisIsMyFunction() {}
  ```

3. ํด๋์ค๋ constructor์๋ `PascalCase`๋ฅผ ์ฌ์ฉํ๋ค.

- ex)

  ```jsx
  // bad
  function user(options) {
    this.name = options.name;
  }

  const bad = new user({
    name: "nope",
  });

  // good
  class User {
    constructor(options) {
      this.name = options.name;
    }
  }

  const good = new User({
    name: "yup",
  });
  ```

4. ํจ์ ์ด๋ฆ์ ๋์ฌ + ๋ช์ฌ ํํ๋ก ์์ฑํ๋ค.
   ex) `postUserInformation( )`
5. ์ฝ์ด ์ฌ์ฉ์ ์ต๋ํ ์ง์ํ๋ค.
6. ์ด๋ฆ์ ๋ค ๋จ์ด ์ด์์ด ๋ค์ด๊ฐ๋ฉด ํ์๊ณผ ์์๋ฅผ ๊ฑฐ์น ํ ์ฌ์ฉํ๋ค
   </div>
   </details>

<details>
<summary>๋ธ๋ก(Blocks)</summary>
<div markdown="1">

1. ๋ณต์ํ์ ๋ธ๋ก์๋ ์ค๊ดํธ({})๋ฅผ ์ฌ์ฉํ๋ค.

- ex)

  ```jsx
  // bad
  if (test)
    return false;

  // good
  if (test) return false;

  // good
  if (test) {
    return false;
  }

  // bad
  function() { return false; }

  // good
  function() {
    return false;
  }

  ```

2. ๋ณต์ํ ๋ธ๋ก์ `if` ์ `else` ๋ฅผ ์ด์ฉํ๋ ๊ฒฝ์ฐ `else` ๋ `if` ๋ธ๋ก ๋์ ์ค๊ดํธ( } )์ ๊ฐ์ ํ์ ์์น์ํจ๋ค.

- ex)
  `java // bad if (test) { thing1(); thing2(); } else { thing3(); } // good if (test) { thing1(); thing2(); } else { thing3(); }`
  </div>
  </details>

<details>
<summary>์ฝ๋ฉํธ(Comments)</summary>
<div markdown="1">

1. ๋ณต์ํ์ ์ฝ๋ฉํธ๋ `/** ... */` ๋ฅผ ์ฌ์ฉํ๋ค.

- ex)

  ```jsx
  // good
  /**
   * @param {String} tag
   * @return {Element} element
   */
  function make(tag) {
    // ...stuff...

    return element;
  }
  ```

2. ๋จ์ผ ํ์ ์ฝ๋ฉํธ์๋ `//` ์ ์ฌ์ฉํ๊ณ  ์ฝ๋ฉํธ๋ฅผ ์ถ๊ฐํ๊ณ  ์ถ์ ์ฝ๋์ ์๋ถ์ ๋ฐฐ์นํ๋ค. ๊ทธ๋ฆฌ๊ณ  ์ฝ๋ฉํธ์ ์์ ๋น ํ์ ๋ฃ๋๋ค.

- ex)
  `jsx // bad const active = true; // is current tab // good // is current tab const active = true; // good function getType() { console.log('fetching type...'); // set the default type to 'no type' const type = this._type || 'no type'; return type; }`
  </div>
  </details>

<details>
<summary>๋ฌธ์์ด(Strings)</summary>
<div markdown="1">

1. ๋ฌธ์์ด์๋ ์ฑํฌ์ฟผํธ `''` ๋ฅผ ์ฌ์ฉํ๋ค.

- ex)

  ```jsx
  // bad
  const name = "Capt. Janeway";

  // good
  const name = "Capt. Janeway";
  ```

2. ํ๋ก๊ทธ๋จ์์ ๋ฌธ์์ด์ ์์ฑํ๋ ๊ฒฝ์ฐ๋ ๋ฌธ์์ด ์ฐ๊ฒฐ์ด ์๋ `template strings`๋ฅผ ์ด์ฉํ๋ค.

- ex)
  `` jsx // bad function sayHi(name) { return 'How are you, ' + name + '?'; } // bad function sayHi(name) { return ['How are you, ', name, '?'].join(); } // good function sayHi(name) { return `How are you, ${name}?`; } ``
  </div>
  </details>

<details>
<summary>ํจ์(Functions)</summary>
<div markdown="1">

1. ํ์ดํ ํจ์๋ฅผ ์ฌ์ฉํ๋ค.

- ex)

  ```jsx
  var arr1 = [1, 2, 3];
  var pow1 = arr.map(function(x) {
    // ES5 Not Good
    return x * x;
  });

  const arr2 = [1, 2, 3];
  const pow2 = arr.map((x) => x * x); // ES6 Good
  ```

</div>
</details>

<details>
<summary>์กฐ๊ฑด์๊ณผ ๋ฑ๊ฐ์(Comparison Operators & Equality)</summary>
<div markdown="1">

1. `==` ์ด๋ `!=` ๋ณด๋ค `===` ์ `!==` ์ ์ฌ์ฉํ๋ค.
2. ๋จ์ถํ์ ์ฌ์ฉํ๋ค.

- ex)

  ```jsx
  // bad
  if (name !== "") {
    // ...stuff...
  }

  // good
  if (name) {
    // ...stuff...
  }
  ```

3. ๋น๋๊ธฐ ํจ์๋ฅผ ์ฌ์ฉํ  ๋ `Promise`ํจ์์ ์ฌ์ฉ์ ์ง์ํ๊ณ  `async`, `await`๋ฅผ ์ฐ๋๋ก ํ๋ค
   </div>
   </details>

<hr>
</br>

## ๐ณ Branch

๐ฑ git branch ์ ๋ต

`main branch` : ๋ฐฐํฌ ๋จ์ branch

`dev branch` : ์ฃผ์ ๊ฐ๋ฐ branch, main merge ์  ๊ฑฐ์น๋ branch

`feat branch`: ๊ฐ์ ๊ฐ๋ฐ branch

- ํ  ์ผ issue ๋ฑ๋ก ํ issue ๋ฒํธ์ isuue ์ด๋ฆ์ผ๋ก branch ์์ฑ ํ ์์
  - ex) feat/#`issue num`-`isuue name(๊ธฐ๋ฅ์์ฝ)`
- ํด๋น branch ์์ ์๋ฃ ํ PR ๋ณด๋ด๊ธฐ
  - ํญ์ local์์ ์ถฉ๋ ํด๊ฒฐ ํ โ remote์ ์ฌ๋ฆฌ๊ธฐ
  - reviewer์ ์๋ก tagํ code-review
  - comment ์  merge ๋ถ๊ฐ!
  - review๋ฐ์ ํ, ๋ณธ์ธ์ด merge.

### branch ๊ตฌ์กฐ

```jsx
- main
- dev
- feat
   โโโ #1-isuue name1
   โโโ #2-isuue name2
```

</aside>
<hr>
</br>

## ๐งต Commit Convention

<aside>
๐  git commit message convention

`ex) feat(๋ณ๊ฒฝํ ํ์ผ) : ๋ณ๊ฒฝ ๋ด์ฉ (/#issue num)`

```plain
- โจ feat:      ์๋ก์ด ๊ธฐ๋ฅ ๊ตฌํ
- ๐ fix:       ๋ฒ๊ทธ, ์ค๋ฅ ํด๊ฒฐ
- ๐งน chore:     src ๋๋ test ํ์ผ์ ์์ ํ์ง ์๋ ๊ธฐํ ๋ณ๊ฒฝ ์ฌํญ ( ์๋ก์ด ํ์ผ ์์ฑ, ํ์ผ ์ด๋, ์ด๋ฆ ๋ณ๊ฒฝ ๋ฑ )
- โป๏ธ refactor:  ๋ฒ๊ทธ ์์ ์ด๋ ๊ธฐ๋ฅ ์ถ๊ฐ๊ฐ ์๋ ์ฝ๋ ๋ณ๊ฒฝ ( ์ฝ๋ ๊ตฌ์กฐ ๋ณ๊ฒฝ ๋ฑ์ ๋ฆฌํฉํ ๋ง )
- ๐ style:     ์ฝ๋์ ์๋ฏธ์ ์ํฅ์ ๋ฏธ์น์ง ์๋ ๋ณ๊ฒฝ ์ฌํญ ( ์ฝ๋ ํ์, ์ธ๋ฏธ์ฝ๋ก  ์ถ๊ฐ: ๋น์ฆ๋์ค ๋ก์ง์ ๋ณ๊ฒฝ ์์ )
- ๐๏ธ build:    ๋น๋ ์์คํ ๋๋ ์ธ๋ถ์ ์ํฅ์ ๋ฏธ์น๋ ๋ณ๊ฒฝ ์ฌํญ ์ข์์ฑ ( ๋ผ์ด๋ธ๋ฌ๋ฆฌ ์ถ๊ฐ ๋ฑ )
- ๐ perf:      ์ฑ๋ฅ์ ํฅ์ ์ํค๊ธฐ ์ํ ์ฝ๋ ๋ณ๊ฒฝ
- ๐งช test:      ํ์คํธ ์ถ๊ฐ ๋๋ ์ด์  ํ์คํธ ์์ 
- ๐ docs:      README๋ WIKI ๋ฑ์ ๋ฌธ์ ๊ฐ์ 
- โช๏ธ revert:    ์ด์  ์ปค๋ฐ์ ๋๋๋ฆฌ๋ ๊ฒฝ์ฐ
- ๐ฆ ci:      CI ๊ตฌ์ฑ ํ์ผ ๋ฐ ์คํฌ๋ฆฝํธ ๋ณ๊ฒฝ
- Merge: ๋ค๋ฅธ๋ธ๋ ์น๋ฅผ mergeํ๋ ๊ฒฝ์ฐ
- Init : Initial commit์ ํ๋ ๊ฒฝ์ฐ
```
