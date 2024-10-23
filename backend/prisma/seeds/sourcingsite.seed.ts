import { PrismaClient } from '@prisma/client';

export const InitSourcingSite = async (prismaClient: PrismaClient) => {
  await prismaClient.sourcingSite.createMany({
    // 1 : sellian
    // 2 : crosell
    data: [
      {
        name: '아마존 미국',
        defaultUrl: 'https://amazon.com/',
        target: 'amazon',
        type : 'amazon_us',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAllBMVEVHcEz////////////////////////9/f7///////////////////////////////8AAAADBQX29vb/owD/+vG2trbZ2dmZmZn/26n/8d3v7+//9eb/yHpISUn/1Zr/48GmpqY+Pz8jIyP/rxb/u0oxMjJsbW3j4+PAwcH/6Mj/wGHMzMx7fHxfYGDFxcX/tC0NDg6Li4slqlgLAAAAD3RSTlMAooK1rWYj+jfodsRYfMGCSs7OAAABRElEQVQokW2T2XqDIBCFSZsE0w1EUEFi3Jfsff+XK6ttUubG4fzMcZxvBABEa4j+BVxHQMXbH4UQ8nvaqLqFpFOmgqWLTwReXSayPTaxr3z1Cvh7Z4tijO/MSTvgEmb0vsFxjGtf6qH2rFMi9po+w0vTxJN6XkMQkXEkUIgwRCJl2XBpgvB07m27AZjW5huHc6hSdYnv1SjSABRa+1biKQCZ1q4qyXSSPsJKaxVCY28sHqF5Vc9Og24X+1LfkBX97KdHyKyKh6rBOINPQ5guevRMIFYziCinFvKSmuESuySQINolyZEbSMvW4iXoTA8dd7Z525a8cBdowfP2WEp1tGsyH5Okk/lBRS6Vp+T5rNdkba/nCrtoZY6Q9lmByLXND6W83W6dLOfCKlCt9Wbn26BFsbxZmX7old++vP/7H+DX5xaAHw4uN1n/ebb2AAAAAElFTkSuQmCC",
      },
      {
        name: '아마존 일본',
        defaultUrl: 'https://amazon.co.jp/',
        target: 'amazon',
        type : 'amazon_jp',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAllBMVEVHcEz////////////////////////9/f7///////////////////////////////8AAAADBQX29vb/owD/+vG2trbZ2dmZmZn/26n/8d3v7+//9eb/yHpISUn/1Zr/48GmpqY+Pz8jIyP/rxb/u0oxMjJsbW3j4+PAwcH/6Mj/wGHMzMx7fHxfYGDFxcX/tC0NDg6Li4slqlgLAAAAD3RSTlMAooK1rWYj+jfodsRYfMGCSs7OAAABRElEQVQokW2T2XqDIBCFSZsE0w1EUEFi3Jfsff+XK6ttUubG4fzMcZxvBABEa4j+BVxHQMXbH4UQ8nvaqLqFpFOmgqWLTwReXSayPTaxr3z1Cvh7Z4tijO/MSTvgEmb0vsFxjGtf6qH2rFMi9po+w0vTxJN6XkMQkXEkUIgwRCJl2XBpgvB07m27AZjW5huHc6hSdYnv1SjSABRa+1biKQCZ1q4qyXSSPsJKaxVCY28sHqF5Vc9Og24X+1LfkBX97KdHyKyKh6rBOINPQ5guevRMIFYziCinFvKSmuESuySQINolyZEbSMvW4iXoTA8dd7Z525a8cBdowfP2WEp1tGsyH5Okk/lBRS6Vp+T5rNdkba/nCrtoZY6Q9lmByLXND6W83W6dLOfCKlCt9Wbn26BFsbxZmX7old++vP/7H+DX5xaAHw4uN1n/ebb2AAAAAElFTkSuQmCC",
      },
      {
        name: '아마존 독일',
        defaultUrl: 'https://amazon.de/',
        target: 'amazon',
        type : 'amazon_de',
        activeWebSite: [1],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAllBMVEVHcEz////////////////////////9/f7///////////////////////////////8AAAADBQX29vb/owD/+vG2trbZ2dmZmZn/26n/8d3v7+//9eb/yHpISUn/1Zr/48GmpqY+Pz8jIyP/rxb/u0oxMjJsbW3j4+PAwcH/6Mj/wGHMzMx7fHxfYGDFxcX/tC0NDg6Li4slqlgLAAAAD3RSTlMAooK1rWYj+jfodsRYfMGCSs7OAAABRElEQVQokW2T2XqDIBCFSZsE0w1EUEFi3Jfsff+XK6ttUubG4fzMcZxvBABEa4j+BVxHQMXbH4UQ8nvaqLqFpFOmgqWLTwReXSayPTaxr3z1Cvh7Z4tijO/MSTvgEmb0vsFxjGtf6qH2rFMi9po+w0vTxJN6XkMQkXEkUIgwRCJl2XBpgvB07m27AZjW5huHc6hSdYnv1SjSABRa+1biKQCZ1q4qyXSSPsJKaxVCY28sHqF5Vc9Og24X+1LfkBX97KdHyKyKh6rBOINPQ5guevRMIFYziCinFvKSmuESuySQINolyZEbSMvW4iXoTA8dd7Z525a8cBdowfP2WEp1tGsyH5Okk/lBRS6Vp+T5rNdkba/nCrtoZY6Q9lmByLXND6W83W6dLOfCKlCt9Wbn26BFsbxZmX7old++vP/7H+DX5xaAHw4uN1n/ebb2AAAAAElFTkSuQmCC",
      },
      {
        name : "파페치",
        defaultUrl : "https://www.farfetch.com/",
        target : "farfetch",
        type : "farfetch",
        activeWebSite : [1,2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAX1JREFUeJztlsGKgkAcxnuWtUAUgnyAkgLvQR4L04NsF32E8OALdOquXTyUB2/rE3jZY0HqJbxosNAhCWN39rJNY9G0uuwu9N0Gv/l+w38+BivvP6wKsk6SxLZtXdcVRXkurM1mcwIcDgfDMFiWrVarTyVpuVxWvtLH43GtVisrGgWYpll6+gkQx3Gr1cp/bjQaPM/Lslz0DubzOUEQcDTDMJZl7ff7clqkaRpy9sViUTz6BABDQI6fpmmZgMFgAAO63e41NygbGKvnea7rvmBot9t9Avr9PgwQRTEffTweQWiv16NpGrmw2y1CAKPRKA9wHIckSczcuwHb7bZer9+bfgdgNpvlN4NBkbe0Wq2wAKqqItHT6TSKordbyrIMCzAcDmEDx3Fg57WmIcICCIIAG8ASM/2bAEmSCgFA05vnoigKNoBlE0/r9foCoERdrun/B4AWTs7VbrdhQ6fTmeAJ/EL8RosegAfgLwLAk/QKKQxDxOT7PmwIggAf8AHtuMMlPIyv+QAAAABJRU5ErkJggg==",
      },
      {
        name : "마이테레사", 
        defaultUrl : "https://www.mytheresa.com/",
        target : "mytheresa",
        type : "mytheresa",
        activeWebSite : [1,2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEXt0QTt0QPt0ATqzgTx1APozATIsAMAAAD32QSfjANaTwHPtgQqJQC4oQO6pAMzLQG/qQOjjwNjVwHz1QSrlgNPRQGynANAOAH01wRIPwHixwT93wTYvgQjHwGAcAKQfgNEOwFsXwITEACIdwNgU+CuAAAAnUlEQVR4AeTPgxXAMBAA0F5YI6q9/4y1V2hw+k9nWXAdtMXH4GeI9zGyECZLRegDCeP2mhzX5h4B2w/IhSS0o5AAihNhx74tlbbhRqPC1CYqSERm54bwAh4Y5CWv7JotCFXetNkLu9LpvaF0FpSMr/ZEG+dC2SuSRHwxIx4n2Y7uG02UZf0ol1VW1C8ETAHoUmMMsIV5mMHHMFKTCQBaRApyfZsL1AAAAABJRU5ErkJggg=="
      },
      {
        name: '알리',
        defaultUrl: 'https://www.aliexpress.com/',
        target: 'aliexpress',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACqklEQVRYhe2Xz0vTYRzHX8/z3S8T1hyKJSEhBh5kSRjYyDSkg2JQ0MU/IIToFNnu3iajUwQjBQ9Wl26NDCIcIXYIlMybMDqkBIpjY1+duj1Ph21mtE239uPS+/jl+3xer+fh+3yf5yPIRgcZBHwavAKcVCEa4gKWAL8YJwwgsvDHgB+Q1QDniQJ8YpyAyM78Yw3hxyWGpAZfHeBkmT6LAC+ASoL5VZCMSNJx0LqyNCHAcIKjQ9F4WSMdAHiFDqIPt2EnZKBMUVlqgchGjXs0jbUZpErWFg6gTJFhJkEmVmRN4cclEisSmYzUHp5LMiKQ6Vjd+KRjINFFVkBUYHcWq6FF4f3vmnpF68IGVk9f2Wyrp4/W8AauqZcF38kvICWOoTvIpmbs/cNlC9j7h5GuZhxDd0EWQOV9qhQqFgXAaDlftkBurIpFQakSBIDU+jcAbFeuly2QG5urVZLA/uJ7AIz2Tmy9A6XDewcw2jv/qFWSwF5oDrVrIoTAOREAq+30dKsN50QAIQRq12QvNFe6gIpuY84GMvW6enBNToNhORluWHBNTmPt6gHAnA2gotulCwAkZvwcLC8C0DAyhjs4f7SsedntnbiD8zSMjAFwsLxIYsZf1FdseixFD15x1o37eQhb91UAdOqQ/U/v2P/8gdSPCACWCx3Yr93CfmMEYbFm4Gtf2Hkwio7t/JsAAI4GnI+mOHPvPsIwir6q02l237wg/vQJJPdOLH06gWwsl7ppHHuI/eZtZFMLQmR+41prVHSL/YW3mK+fkVpfO23J0gR+jxIYbReRLecAUFs/SW9+L+saVZ5ABVOPy+h/gb8E4nXkxyWZXq1eWZJkesL8h3V1owC/bFtNhcm0Z7WUUICvbTUVPrqRbnosg1kRL1Vqz8l8b0uAPztxfgEVaeU3I5lENgAAAABJRU5ErkJggg=="
      },
      {
        name: '라쿠텐',
        defaultUrl: 'https://www.rakuten.co.jp/',
        target: 'rakuten',
        type : 'rakuten_search',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEX////////77e389fXXdnblqanqsrK7AADEDw/SXl7xzc2/AADLQkLHJSX33t7qwsLknp7ejo5Qc15dAAAAAXRSTlOPPeFG1wAAAKxJREFUeAF00AUChDAMAEHqjZb+/7OXc0sWZ9AeRwrz7dkL8y0fS73VevZw3JuAHtIjRhenkK0HZAeH3YJiqh6uZGrYItRJ44xwRXc21c5EhA4SM8sIvpZokCUYDwL15CJUuD5VU/C1bJtaAkQhovA/u+HEAMu2HSm/OAwtBdvjJ0Y9sfTzp9a7Pu9sMu4RCUPduy8tT0yLp9jJ1jpq/hsExfdZ6zIiHIQ3OwAAK2MLpru7EUYAAAAASUVORK5CYII="
      },
      {
        name: '라쿠텐패션',
        defaultUrl: 'https://www.rakuten.co.jp/',
        target: 'rakuten',
        type : 'rakuten_fashion',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEX////////77e389fXXdnblqanqsrK7AADEDw/SXl7xzc2/AADLQkLHJSX33t7qwsLknp7ejo5Qc15dAAAAAXRSTlOPPeFG1wAAAKxJREFUeAF00AUChDAMAEHqjZb+/7OXc0sWZ9AeRwrz7dkL8y0fS73VevZw3JuAHtIjRhenkK0HZAeH3YJiqh6uZGrYItRJ44xwRXc21c5EhA4SM8sIvpZokCUYDwL15CJUuD5VU/C1bJtaAkQhovA/u+HEAMu2HSm/OAwtBdvjJ0Y9sfTzp9a7Pu9sMu4RCUPduy8tT0yLp9jJ1jpq/hsExfdZ6zIiHIQ3OwAAK2MLpru7EUYAAAAASUVORK5CYII="

      },
      {
        name: '라쿠텐24',
        defaultUrl: 'https://www.rakuten.co.jp/',
        target: 'rakuten',
        type : 'rakuten_24',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAb1BMVEW/AADCFBS9AADSdHT////bjY27AAC8AADkrq767e26AAD35uboubnRb2/bkZG+AADIQEDsxcXKTU3Yg4Ppv7/hoqLQaWnJRUXOYGDUfHzUenrEJibFKyvFNTXip6fdmJjkrKzx09Puy8vDHR3KUFDgIzJYAAABGUlEQVR4AbWRVWLEIBRFCbl5kAcMcR1Nu/81lkwNKj+Vg3NwxO/IhPxOyRwodktKCEUfpRZl6GNjlbKGU+mAgxS+Qi5ljsqnM2tdk1AaYTpBq1j6puW68gS772lByUzd9a5RA0YfGiOmxCoOOxYo1b1RotgHvUo/4ROTf113RjH36OY2MHfo5wKzfJULxnXN1uOdUFlHLG9yxifeZvpTi7PL3eDyPA+ZO6M9efFqJS6kGluwlJdB0QUyeiaGVR5X9NyjCw+M+IHJ3Eh4NlePulN0MxTLrWQR+rjWvSUut1juj07bjRmBidPHlwdkAsacHx66TWY4yPRLK3LOPTKPI1dwsfQjNn29XvWdDWP64SUiSikSiCNI/CtPFbcQzLnyUZsAAAAASUVORK5CYII="
      },
      {
        name: '라쿠텐BIC',
        defaultUrl: 'https://www.rakuten.co.jp/',
        target: 'rakuten',
        type : 'rakuten_bic',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAb1BMVEX////Yg4PVd3fXfn7rw8PfnJzDIyO5AAC8AADLT0/tycnFKyv++/vCHR3BExPGNDT89fX35ubHPT3z2trIQ0PJR0fbjo7nuLjmtbXjqqrv0NC/AADUdHT46OjOYGD78fHioqLelpbNWFjYgoLSZ2fqYjTWAAAA8ElEQVR4AdVQRWLDMBAcU3bNTGIp/v8XyxC8tyNYRvxDRHGcpJ9sdiLOi0tjyUQUvzFVTczUcHRhbKnrBxqBaV7W/j3VdmkEUto/+CJuKRPy2qiogM5mIpjBtqR/jfIkeQASkuw61zvm8cIoP0THkpEwIabuMq2gBtDErvKZEDxd11zIAAljkLNkGn+NswQQ5Ab4wJKZf7fQ2aqy1nad7TuIOA/+tyAqQ8ST8uto8QAaT5GaUYznsdeJLbq0S028Q1dfxnVRTpXpkqk9TD5azeHd0n8Zt/1Q4UjU5KLEp8tqpmg/9xc9fX7VdzJ0+It4BfdBEFCPXVFUAAAAAElFTkSuQmCC"
      },
      {
        name: '라쿠텐딜',
        defaultUrl: 'https://www.rakuten.co.jp/',
        target: 'rakuten',
        type : 'rakuten_deal',
        activeWebSite: [1, 2],

        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEX////////77e389fXXdnblqanqsrK7AADEDw/SXl7xzc2/AADLQkLHJSX33t7qwsLknp7ejo5Qc15dAAAAAXRSTlOPPeFG1wAAAKxJREFUeAF00AUChDAMAEHqjZb+/7OXc0sWZ9AeRwrz7dkL8y0fS73VevZw3JuAHtIjRhenkK0HZAeH3YJiqh6uZGrYItRJ44xwRXc21c5EhA4SM8sIvpZokCUYDwL15CJUuD5VU/C1bJtaAkQhovA/u+HEAMu2HSm/OAwtBdvjJ0Y9sfTzp9a7Pu9sMu4RCUPduy8tT0yLp9jJ1jpq/hsExfdZ6zIiHIQ3OwAAK2MLpru7EUYAAAAASUVORK5CYII="
      },
      {
        name: '라쿠텐랭킹',
        defaultUrl: 'https://www.rakuten.co.jp/',
        target: 'rakuten',
        type : 'rakuten_ranking',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAZlBMVEX////89PT56ur25OTsx8fWfHzBGBi+AADz29vuy8vqv7/Udnb36enDJCT9+Pj03t7w1dXai4vHPT3NWVm2AADgnp7BDw/ntrbEKyvYhYXIQ0PSbW3KSUnRZmblra3PYGDWgIDhpKQVahCXAAAAkElEQVR4AexRgwHFQAxNT0Fta/8hv80F+o6x4D82eOr0aHMm1ZPQOiRgJT7oAAIKIzDgxfFFmEia5UVpK4OQWaybtktDd3bUNigd9GWRgoOB8hgHHBO2Z8t6mJCqcsYAYyR3cFy3bPyTcKKoN3PKolOaF1h9Huo6pgluKMdxnMfRpmXNpOAFqyQ62ua6H4kAAPojB7nHBAN1AAAAAElFTkSuQmCC"
      },
      {
        name: '타오바오',
        defaultUrl: 'https://world.taobao.com/',
        target: 'taobao',
        type : 'taobao',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAIAAAD9b0jDAAACOElEQVR4Aa2SA68eURCGt/0hVYw2asO6YY3oRo1q27Zt27Zt27YRlTt92pk9s5u63cmbL3NmZ57BvZEsK5y7IlmYvyJZkL8imZe/Ipmb1WyTP2f68w/lFKufFsmaejimjQ1layuCiva4y8uDsp9nFZVP70VtSRUZG8nbh/bkE09+ablngBwaKYh+RKY4QcVoifhGdrBT82VpNfNBX97k/bC0//CMogMKlisz6cxS8uSKpI3n4clCJzKZGq2q7z3GOsc9Sx3xLRVnWw8fU+3m3niw4Sx5dMRC+pH8wLUky9gxjDWplHk1kiMs9XG29CWe0bTSBD1ztKFSxIklwppwhc4Xd8W9Iz/Id0Ym0LCHjAjQ0YkIManai3twIdpZd0+URQUBRSYzIubwkjvHKFEULBdRfg10aA5QBmEv4mkoT3AozOH7jUAOdS4SjN1xfm20X9vDob0NAuI7TaigK8c9magWkukFoRjTCKvIuHKyrr+v31sJ30O7RhyUnHhESTm1Dkd97WTPJhEIwRY3zUB7BmjvlDpaNty4dcQF/IgMFaBdk7vzu6ijBkkmrpw0sVCgkEoDLhD+GcLUHlHjCImTgjIz6pzMiL19GLf/GiQJX9wMR0sugEPXMAenIF9pVJpCT87EmBqEzt8ECjX8fYiAg0WEp5dwrraOco8jxgPLMC93YHAL4nR0aVyyRolmOpSHqyNoK/5entO9GGPqsPjfl/D+e3HxtibW+j6BjPxFt/zFEfOXHiVnfQEbm98sQWI+2wAAAABJRU5ErkJggg=="
      },
      {
        name: '테무',
        defaultUrl: 'https://www.temu.com/',
        target: 'temu',
        type : 'temu',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEVHcEz7dAD7cAD7aAD7dwH7dwH////7dwH7dwH7dwH9tY/8lFX7hjb+7OT/9vL9x6z+1sL8pna0tt6eAAAACnRSTlMA////+f//zndAJf3EsgAAASZJREFUOI2Fk4uSwyAIRQPUm1TBx///7EIebWe7G++MGOUYQXFZXNv6SF96rNty6PntvPSc+A/izp+S738PbMt6D6zLH/F/6jEJwYPYLRG5eU3SNXUCpEMHkeqFKCcupfALKICJoso+laSaGIDKF+DDId2pViUA1ILibdAB8ECszr6oCbEUawM1GzKfQSJcw9CAUXoH5YDxBnqFDcm99czdrLB3oVea4vLAd+uNyDtmlgvQ7Bp8WiVPkT2+aDtAI/arGtb0SFihpCh0pZkhUqDiGXho9htInqHEablT4Qm0f4Dhe/t/WgmgyAdAB2Bm3WdZGqSiYz/WA9DmR9JanEOLu8lMuWf6uO64Fg4lPofx/QbuCmZactOinZb99OHMn9708U6e/w9tkhd/5Gh63wAAAABJRU5ErkJggg=="
      },
      {
        name: '잘란도',
        defaultUrl: 'https://en.zalando.de/',
        target: 'zalando',
        type : 'zalando',
        activeWebSite: [1],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAy0lEQVR4AWP4//8/w7sbxyz+1yrd/Z/D9uN/o9bV/ytSZj84vsnnx48vXCB5fJjh798/jL9aDM7/zwTy0XGF1NMPG5tqPr17JYLTgMdXTxn/z2b5BdKAE5eKvby1cUrWr58/2DAMuL+6rQKikDD+1OW09+2Te/IoBvyfEbAOv0ZMb725esQKYUCTzmWQBEm4SODd2yuHbMAGgDggQZJxmdjL9y8eyDHAApAsvDJnMsUGUOwFygKR8mikPCFRnpQJZ6YNDXX4MhPF2RkAdGmROohQz7sAAAAASUVORK5CYII="
      },
      {
        name: '올리브영',
        defaultUrl: 'https://www.oliveyoung.co.kr/',
        target: 'oliveyoung',
        type : 'oliveyoung',
        activeWebSite: [1],
        imageUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADIElEQVRYha2XS2xNQRzGf+fUAk3TCDvSlA4GIQhtKt4WFhUsxAI7EQsLhMiNx5BpF2cjnhvEAkljIRELryAW4pVUSAQTmYoghFUrFa/qtbjn1nHMmXuv3m818/++8/++m3vOPAIqhLZyGdAMCGBUXO4BXgFdSphrlfQLyjRdBBwAFpfZ9yGglTBXhhRAW9kEXAUmZkj6gdN58o8GwoGgZqBmEbAuwb8H2pQwTyoOoK3cC7R78m1TwhwpTvJcGBGw5mv87AOgJaE9rITZXnYAbeUlYGWGcT/QoIT5AJDP5VYDF2PuZRBFk+Me94DWxHN3lTDzSwYoYQ5Qp4Tpi81nAo9T/MkgijbHvfIp7r4SZl6yEKbM95Qwn1o0j3HWoVmfGG9Nca3ayuPOANrKCUCHx7xDCfMiVZvu0NUWB0qYow5+i7ay+Z8AFN72LPQpYfYlC/lcrjFD+yk1v+nQDH6eIYC2ciEwyRNgs6P2PkN7PjV3LUyjtZVrBwMA+z3mP5UwneliEEU/AOPQ70jNH2X03Z8MsNQT4JCHWwx8i8e9QFMQRf0pzeuMZ6dqK2uHaSuXeAwATmURQRR9BEbkc7n6IIp6M2Q9nt5tITDXI/ihhLElAuIxB0ivBUk0hxR2tSxcL2VeBuo8XFPIny3VhYdVCDDWw40K8e+Iz6oQYIqHC0L8L8m7KgRo8XA9IdDtEXyuQoDlHu5VCHRVwcQJbeVwYLxH0hUqYW54BPVDzLCxBH+5uBLezRA0DjHALg/XrYTpKQbIOnrN+l9nbWUL0OCRtEO8FyhhrgNvHSLfC1QKZzzcFyXMmcEAMdocwtnayppKnbWVG4DJHsmq4mAwgBLmKXDQId5doXkdcM4j6VTC3PonQBxiJ3An3bOSABRuSFl4roRJnhkzj+V3gOQRuksJ49s10VaGwBuy1/7nSphp6WLoUiphFgDHEqU52sr7HvM24JfHvNNlDqWvZnMpHCDHJMongNvAd2AGsAkYl9HiC7Aq+Z9XFCARZA2Fy6nzVzjQDbQXPzUfygqQCDISWEHhFFW8ngckrufAZSWMb4f9C78BTeLlIovfX+0AAAAASUVORK5CYII="
      },
      {
        name: '이베이',
        defaultUrl: 'https://www.ebay.com/',
        target: 'ebay',
        type : 'ebay',
        activeWebSite: [1, 2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAABLUlEQVR4Ae3WJUADYRjG8UMzDpmCJNyl4ZpxSbhrQ9viGu4Oc+8BJ7KCR5y2vXzPrOCypS/8J2e/8zshu63ApXHw3ZpbWkKR08G2trZS1hrrBNl+lzoDBNbMugPU2tYmQjYUw5r/Fewersi0LXha3FUYYh+O3xiGcZjm30D71rx33DDMvtV/Ao1J6XH2xvtrDdWNYyrfuqNYe/cbfo4wHmErx1RBEehH4FVMUjjr6SY6gZA6o8ocWa42CfUnZKnCSCQT6GXLzdL5lmCalPmaR1XBhMZUwU9Afw1qMyopokJDH4GX2140pfCn74Mc5CAHOYinwF9BLOPbIGLQwm9BkSpw5VePp73kYjFgfEeUayQMs1ZxKmGg5HnLXcJAyeW2twQIYls3yN/a/jUOvgKkonKBWnbPogAAAABJRU5ErkJggg=="
      },
      {
        name: '네이버 스마트스토어',
        defaultUrl: 'https://www.smartstore.naver.com/',
        target: 'smartstore',
        type : 'smartstore',
        activeWebSite: [1],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAJFBMVEUdyAAdyAAdyAD///8AxAD0/PSh55ff99rF8L5a1E0yzhaH33ktFfUyAAAAAnRSTlPaI68jkd8AAABpSURBVCiRtdM5DsAgDARAgw+O/P+/IZZAiYK3Y6sVQ2UMJcpBKFFoQ4ENPYri+baJwk9KG9W8yhvVj2yibpAvAagdIFeEbAi1BLhu7NAqwl4A5oZQDGDudYNrtE1/g4dPFuQUwqVG3+EGn1gH9uMqCOQAAAAASUVORK5CYII="
      },
      {
        name : "아이허브",
        defaultUrl : "https://www.iherb.com/",
        target : "iherb",
        type : "iherb",
        activeWebSite : [1],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAMFBMVEVHcEwvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTUvmTWzJfIZAAAAD3RSTlMA8si4MAlDGoGlbVaR39TXc/7BAAABNElEQVQ4jX1TWZbEIAgURMQlcv/bjhpjZHp6+MmTYikK4txXC7Fb+IIVSR5ba1f5BGNJoNvqB5wuPS1ZmNuBzTreZPsz11P7FSAbawS9No1m+OL1SO6P4Ga9N+ApDx60hVxcUhNQ3mxRIAqoJiDu4TCQqjgKjuAgyRO8uqtnwxWr5IynDjfDGIeLgN6BqqFYxhcob0KqeQXgYjRauYg1l3znsB2SO7G9nukhqxKGa4iEqUqdRVtcAXm1jC2wWchTjtYJcBgEYR/Ew/FhqV3SwkzE5Wb1XhyvOUV43SGqPZdrvkfc1Tnm7OEYcrFAF9SYnOfUzy2uFT8GBnfBsxj80YBp4drkLzzNjQWGvqV+l3hLALj/mMHep+GfogTiLLnQK8DmZSmb8X6J+mHiESV+x0fjf7Afif8a3/O66NIAAAAASUVORK5CYII="

      },
     
      {
        name : "11번가 슈팅아마존",
        defaultUrl : "https://www.11st.co.kr/",
        target : "11st",
        type : "11st",
        activeWebSite : [1],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAeFBMVEVHcEz4Tjj8Fjr7DdP8DNL8D0L6Ezz4GkD8TjP4E9L/Ajf/AFv/KDL/Czb/AHH/////MzH/AiX/PDP/EjX/Ry//GTT/HzT/AJ//vsn/AIL/AE7/AEf/AIz/AED/ALT/AML/AJT/p7T/ARH/AKn/jaj/Ac7/4Ob/d4O2faDrAAAACnRSTlMAct/J39/Icthy0OYucQAAAQlJREFUKJF90l1XgzAMBuDX6YZ2lJKyMsCPWWTw//+hSTrU46F7L7h5TtIkBwAPzyeO976u65LTtiE0za4AR+nX2mTW2gPXnbbq2IwpsNlTzeyRt/dXbL+nNiBfNxxxx45QKwNbIBsa0iQTrOsxRirJdwuFTrKQWgU2Pzs30uJcpNZpJiNWgXs6N7tx4U8ko11nNw1sitF3jBMxplkMK2MPnpNGxoasVOqcw9C5WPU9ZAcStAnTnIpvgu0fTDarfUJuJsivuTgm5SfFzoJhxZ8kO0NuRpPO2a252Rf0nqQ73KbhHZJ94N+tZffVGPN2wR1jzNsVu7w9ocja9QU45OxRfvliv9mT674Bye86XmqnhxUAAAAASUVORK5CYII="
      },
      {
        name : "스마일배송",
        defaultUrl : "https://www.smaily.co.kr/",
        target : "smaile",
        type : "smaile",
        activeWebSite : [1],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEUzM5MxMZIxMZEqLJIgJZQVH5Y+PIOFclq2mUDPrS6SfVTtxBP6zgv/0wD/2gDbtiJJRXdbUnfOALraAAAAAnRSTlNa8xJz20AAAAC6SURBVHgBjJFVAgMhDAV3SXAie//D1hukOj/IoC/btrsP7ObeW/eFvyWg9whvJYaYck4x4IsEKLXRhVYLwCJDZnrAOcAkwdyVPEksoyMuOMhQaaKGLiG2WbYIJjHRQkKTPhPxAFH2oxTV4K4JuaAqo8RE4sHi8DIeC5GaG2gUYfpKsUixUA1zCHI8LB5iIVh8+UC4dPC4dJdsQ+aaFFFTnYK3khFfoKlkX4ttAJyHnkzIT314EzXe7AAA/zkOpzRGVhsAAAAASUVORK5CYII="
      },
      /** active website only for 2 */
      // POLO
      {
        name : "폴로",
        defaultUrl : "https://www.poloralphlauren.com/",
        target : "polo",
        type : "polo",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAAwUlEQVR4AXXJERDDMBQG4Of1wnAav1pld8FKqZy7YLVabPwuVqnF4lCnwGhUqkViwX+823uffgQZ/vIskDNEOY8KKesOCFk/AWKODmImp9Yi5ZqDNlLGl5KzHZ3ehJy1dnYV8grt1D6FxPvVKzqFTJY2cicKl6VvhnF5LDOXaPp28g2By2xJTVbTzSWWruuMIbCpzDD4YWYz0+1N3A8294TUIV5srhXe1pDZPICwYAefFVDwfNYeKUmJCgcUIYGMH1/6ssi1/RI9kQAAAABJRU5ErkJggg=="

      },
      // Sneakersnstuff
      {
        name : "SNS",
        defaultUrl : "https://www.sneakersnstuff.com/",
        target : "sneakersnstuff",
        type : "sneakersnstuff",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAjVBMVEX///++vbyCg4NfYV5ZW1ZbXl1TV01RVUbw8O/p6OhOTEpAQD9PUVFXWFdQVFA9Qjfe4N7b29s4OzplaGhqbG1rbm5tb29vcXBwcXJydHRYWlp5eXh4eHliY2Ojo6JER0hpampER0KQkY93eXVrbm+dnZw4NjeNi4v+//vY2dStrKmWmZWvsK1ITE23uLiHm+Y2AAABB0lEQVR4AbWQRwLCMAwE00S1Q5EsOw4KqXT4//Mg3GLOzHVUN/o7cZJmkGXZbL4I1XK1VnokzzfbwO32GsmwdYVJ82Ug994VhS3KsjyIDmR1rK1jrkUAQAdjvSemGhG81noVyAYME9ZJVVVtZxaBFMNsXBLvxn0BORjLPVMtvv35MvG1Y1PXNYraD+GbayCqRxDUug1bj17wK/kAp3DxsFcgUtfEJanzT7hnpTyOCRKsoh8ul2s3WoJmcvENuvO9esSDIDHJVA4rrT5oQex7hHQavJIxcy/E3KN6TORNl0l5KKxzha2hiYJOtNY6y0zo17vgy6f+4r1+HsMIbk2efxQIJq/o37wBpyMZO1Z1ZEcAAAAASUVORK5CYII="
      },
      // Endclothing
      {
        name : "엔드클로징",
        defaultUrl : "https://www.endclothing.com/",
        target : "endclothing",
        type : "endclothing",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVR4AWP4//8/ClaWV/hPADcgq6e5AeeBeD8aTiDFAAcGLGAoGYAZBgakGYCJHehuQAFIExIWABkwYqMRgfspzUz7qWoAAP5V1g8y+aJrAAAAAElFTkSuQmCC"
      },
      // ZOZOTOWN
      {
        name : "조조타운",
        defaultUrl : "https://www.zozotown.com/",
        target : "zozotown",
        type : "zozotown",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAAdElEQVR4AWOgKRgF06YxzA/Mm2/U3Gw/37OhzVMjljUvPJwPIml0ZKfREb4jE5sb2g409JYtm/arre3TMhGI5BHFAxoHJja3NTQ07CxrK2u7PO2l/bRfUGMnzmeYH54336atlyGdAUjEMiRpeKaz0tInowAAzHQpX4uB+aAAAAAASUVORK5CYII="
      },
      // MR PORTER
      {
        name : "MR PORTER",
        defaultUrl : "https://www.mrporter.com/",
        target : "mrporter",
        type : "mrporter",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAOVBMVEVWVlbY2Nji4uL////9/f1HR0d7enpnZ2fMzMwfHx+wsLCLi4u6urrDw8OdnZ3r6+vZ2dn19fXk5OSYraTeAAAAAnRSTlMb3FDAmF0AAAEDSURBVHgBlZOHjoUgFAWVOZRnofj/H7uSYPbdsPXYZTL0ZVndD1nvciTxbdbFdWBmnr9ucepBgGckOPQJPO9vQARhDUIiumH36EtDeokev80GRC+J+3Hm6DUBoxcl1DuhAhrEAIZCLux7SKOT1jAccrXRn2jqBSYaFmt4MlowAJ4GMIcOtIuqlIB+O0p/pFTLWdtZcct1+fJqd/8hpG0vu+5H21tO5Tz2dhvcGXPbIx1gJ7cQGpmcdG6RUUVzzaEKJSeqKpW6HVerzTZSpps9drKmYTBDjY0Q7wAzYQyTQljDrLBDLSZC8K82zOUIu2iZImGme4oxDGQSdGDl+wjWX7f/B6GqEMfAC7mZAAAAAElFTkSuQmCC"
      },
      // NET-A-PORTER
      {
        name : "NET-A-PORTER",
        defaultUrl : "https://www.net-a-porter.com/",
        target : "netaporter",
        type : "netaporter",
        activeWebSite : [2],
        imageUrl :"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIVBMVEV4eHl4eHh/f395eXmIiIgvLzAiIiMKCgpBQUFPT1BkZGRihNlzAAAAAnRSTlMbxq2iYScAAAFeSURBVDiNXZMLkgMhCEQdBAHvf+BtUNQslcok47P5t9Y+6kTkPkTELH73sq/B8phoBjBM1r9eUNyf/QBSwCG+hqOQ5QV4AYcIAO+Ju20XTPwSASjez24SCkbMpXEBFVNPhQDoaCyAAaj6GAk4h20f9AAhEsDMc74SB0AgA0F2XhJccTTmvgA1GQPpHNsxGMpbhGp4QM1cMiRDZm2EcLoAYHPKkLgTcoqPtjgRG/lQj1qIli0AINQdXyhTButhdhUCwClc5pvINkKwDYQ7OBSfRJoS6SaZsIaYfK7soRA1ia6GfsZq7eY9cRcJal6cfHtRFpV0mZF9nlP1Ylv220fWqd+RQLs3skZK+tOL7eIFhk2+E7Nc0Ea8gP8DU4Rnnc35dJoOkMieOT+z8ChkoAX8Tn1vtQdYjz3W70wnsJEVwwL6tfZtorKwpV8M1jefeFPrXeHX8mJ9F3L2/zHc/wMW8RJmRKfAdQAAAABJRU5ErkJggg=="
      },
      // REI
      {
        name : "REI",
        defaultUrl : "https://www.rei.com/",
        target : "rei",
        type : "rei",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAJFBMVEVHcEySioCRiH6Sin+QiX6Si4CSi4CSi4CRi4CRin+QiX+Si4Dw7nz8AAAAC3RSTlMAliV3Fea48dNaOtFfn9AAAACkSURBVCiRdZJBAsMgCAQDqID8/7+1NVUSkOswsqjX5YvwOlZnOLICVvsJajWDkjNsZlY1h8QDWksz/UQzpgyCzZIkEzaepiRTi8qEkA2defJEKPfMLBHZv6K6xFFBhc1M3ipAXcdC2FQXjHdf9rnx2TrvmeHFfaD6CoRODLt4caiPSP4KgorUpDooz21KV9eQXP5ogDZ5Sz/h3cCHTzgaUIG+6gfE/ApRnARtDgAAAABJRU5ErkJggg=="
      },
      // Foot Locker
      {
        name : "풋러커",
        defaultUrl : "https://www.footlocker.com/",
        target : "footlocker",
        type : "footlocker",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAARCAMAAAD5TTx4AAAA4VBMVEVHcEzpww6DUGyDT2x7R2rPOinwZgliWTn2yQf1zAhLmCtVlCyCT2uEUG2BT2nyZAfxZQawNzn6ywVZnSWEUG2xNzpfRlP6ygT6ygb0ZAapO0WDUGz7ywSyNzpXnSb6ywf+ZQH4ZQPxyAz27gywNTpanCVanCZamSeDUGyCrTiDqjtanCZamieEUW30xwv6ZQNrojA+PD8tMDRCP0JBP0FBP0FAPkFAPkFBP0FAPkA+PT9AP0BBP0E/P0BBPkFBP0FBP0FAPkBAPkFBP0FBPkJBP0BanSRbnSZZmyZanSZanSXeeHW1AAAAS3RSTlMAJnSIPSJFBLc+DTZg/VBzW9B15uO8JOzoYxeq//9h2P2sWQe6uIpS1fNznkivV34lMQ70ZXCCweRPQIuwls+8yJ/q2f+p/896x/2NT9BFAAABAUlEQVR4AV2OAwLDQBAAp7Zt29blav7/PzWSzmENXugA9Aa9EUxmLKixWG12B06Xy+XG48WHBqvfEYCgC/wQUgfDbiJRYnESBnRJWzxlSjvSvHG6jP5MPJt76PlkoVjEXipX3sGqy1iIks1mqdVJEjcaHI3mO2hxtaCNpdOha39McerjNCtPtdfjg73/km8Bg+Hoo45Hk5cyhbcymy+EMhRiJuVQzJaTnlRW8/ViPZqsmfbCG7YbxI7RcL9lseuz2vV3D/3RQqzFeL8aruRsMxZyLhVp2a6V4ea9L4BaVdM9/BOwq/KP2tgJDZXAPf1capRPp3Kjyz+O8jlwuARKqqobQw8pU4uYFsUAAAAASUVORK5CYII="
      },
      // StockX
      {
        name : "스톡X",
        defaultUrl : "https://www.stockx.com/",
        target : "stockx",
        type : "stockx",
        activeWebSite : [2],
        imageUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAYFBMVEXV0cjZ1Mt3kX3f2NB5kHvb1c0AUSRfhGxVfmUAWC8AWjMAXjg/dFc2cFELYDsAY0AAYDsaZkTIx70AYj+bqZmwt6qjrp89clXn3daTo5K7vrJMeV6DmYYlaUjLysBGd1vtJ+TaAAAAo0lEQVR4Ac2RRRbEMAhAQ92L1PX+pxy3MHldlxUuH3NWAWVYpud/DT8IraAfxR9HmKS+HczywsCzZZlXvqqskfgWBa5QMjsITSqStxC2mUjaqY3uXuyH8Z4zhUZJyJTPS1rjuoHr0hmxlsSAE8MudY6zKwgsWKdjnxP/RV9rDqtjIXitCY+cBhSE15oh0x2Cxre/8fUKnw0+VuBh0S87fvYZ5QpT6giJYzVZoQAAAABJRU5ErkJggg=="
      },
    ],
  });
};

export const InitUserSourcingSiteCrosell = async (prisma: PrismaClient) => { 
  const user = await prisma.user.findFirst({ where : { email : "crosell"}})
  if (!user) { 
    throw new Error("User not found")
  }
  const sourcingSites = await prisma.sourcingSite.findMany({ where : { activeWebSite : { has : 2}}})
  return await prisma.userSourcingSite.create({ 
    data : { 
      userId : user.id,
      sourcingSites : {
        connect : sourcingSites.map(s => ({ id : s.id}))
      }
    }
  })

}

export const InitUserSourcingSiteSellian = async (prisma: PrismaClient) => { 
  const user = await prisma.user.findFirst({ where : { email : "sellian"}})
  if (!user) { 
    throw new Error("User not found")
  }
  const sourcingSites = await prisma.sourcingSite.findMany({ where : { activeWebSite : { has : 1}}})
  return await prisma.userSourcingSite.create({ 
    data : { 
      userId : user.id,
      sourcingSites : {
        connect : sourcingSites.map(s => ({ id : s.id}))
      }
    }
  })

}