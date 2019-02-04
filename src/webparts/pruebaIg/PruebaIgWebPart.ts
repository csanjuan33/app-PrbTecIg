import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PruebaIgWebPart.module.scss';
import * as strings from 'PruebaIgWebPartStrings';

import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

import { StringRepresentable } from 'lodash';

export interface IPruebaIgWebPartProps {
  description: string;
}

export default class PruebaIgWebPart extends BaseClientSideWebPart<IPruebaIgWebPartProps> {
  
  /**
   * Variable de la Url del Servicio API
   */
  private urlAPI: string = "https://restcountries.eu/rest/v2/";

  public render(): void {

    this.domElement.innerHTML = `
      <div class="${ styles.pruebaIg }">
        <div class="${ styles.container }" id="lsPaisesContenedor">
          <div class="${ styles.row }">
            
          </div>
        </div>
      </div>`;

      /* Prueba de Enmaqutado */

      //let restJon: string;
      //restJon = '[{"currencies":[{"code":"CAD","name":"Canadian dollar","symbol":"$"}],"languages":[{"iso639_1":"en","iso639_2":"eng","name":"English","nativeName":"English"},{"iso639_1":"fr","iso639_2":"fra","name":"French","nativeName":"français"}],"flag":"https://restcountries.eu/data/can.svg","name":"Canada"},{"currencies":[{"code":"COP","name":"Colombian peso","symbol":"$"}],"languages":[{"iso639_1":"es","iso639_2":"spa","name":"Spanish","nativeName":"Español"}],"flag":"https://restcountries.eu/data/col.svg","name":"Colombia"},{"currencies":[{"code":"USD","name":"United States dollar","symbol":"$"}],"languages":[{"iso639_1":"en","iso639_2":"eng","name":"English","nativeName":"English"}],"flag":"https://restcountries.eu/data/usa.svg","name":"United States of America"},{"currencies":[{"code":"EUR","name":"Euro","symbol":"€"}],"languages":[{"iso639_1":"de","iso639_2":"deu","name":"German","nativeName":"Deutsch"}],"flag":"https://restcountries.eu/data/deu.svg","name":"Germany"}]';
      //this.ListarPaises(restJon);
      /* Prueba de Enmaqutado */

      this.BusquedaListaPaises();
  }
  
  /**
   * Método para la búsqueda de la lista de País. 
   */
  private BusquedaListaPaises(): void{  
  
    this.LlamarServicio(this.urlAPI + "all?fields=name;languages;currencies;flag")
    .then((response)=>{ 
      this.ListarPaises(response);  
    });  
  } 

  /**
   * Método para la búsqueda de la información del País a consultar. 
   * @param nombre Nombre del País a consultar.
   */
  private BusquedaPais(nombre: string): void{  
  
    this.LlamarServicio(this.urlAPI + "name/" + nombre + + "all?fields=name;languages;currencies;flag")
    .then((response)=>{  

    });  
  }
  
  /**
   * Método que permite realizar el llamado al servicio.
   * @param url Url del método.
   */
  private LlamarServicio(url: string): Promise<string>{ 
    try {

      return this.context.httpClient.get(url, HttpClient.configurations.v1, {
            headers: { "Accept": "application/json;odata=verbose" }
          } 
        )
        .then((response: HttpClientResponse): Promise<string>=>{  
          if (response.ok) {  
            return response.text(); 
          }
      });  
    } catch (error) {
      console.log(error);
    }
  } 

  /**
   * Método que permite pintar la información de la consulta al método All.
   * @param listaPaises Json con el resultado de la consulta al método All.
   */
  private ListarPaises(listaPaises: string): void{  
    try {

      let itemsHtml: string = "";  
      let jsonObj: JSON = JSON.parse(listaPaises);

      jsonObj = JSON.parse(listaPaises);
      itemsHtml += '<h2>Lista de Países del Mundo</h2>';

      for (let principal in jsonObj){  
        itemsHtml += '<div>' + 
                     '<div><img src="'+ jsonObj[principal]["flag"] + '" style="width:100px; height: 60px; float:left;"></div></div>' +
                     '<div><b>País - </b> <Link href="/">' + jsonObj[principal]["name"] + '</div>' +
                     '<div><b>Idioma(s) - </b>';

        for (let lenguaje in jsonObj[principal]["languages"]){
          itemsHtml += jsonObj[principal]["languages"][lenguaje]["name"] + " ";
        }
        
        itemsHtml +='</div>' +
                    '<div><b>Moneda - </b>' + jsonObj[principal]["currencies"][0]["name"] + ' - Simbolo ' + jsonObj[principal]["currencies"][0]["symbol"] + '</div>' +
                    '</div><div style="border-bottom:1px solid black; margin:5px 0px;"></div>'; 
      };  

      this.domElement.querySelector("#lsPaisesContenedor").innerHTML = itemsHtml; 
    } catch (error) {
      console.log(error);
    }
  }  
  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
