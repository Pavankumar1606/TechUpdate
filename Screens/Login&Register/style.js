import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
      },
      textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
      smallIcon: {
        marginRight: 10,
        fontSize: 24,
      },
      logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        height: 260,
        width: 260,
        marginTop: 30,
      },
      text_footer: {
        color: '#05375a',
        fontSize: 28,
      },
      action: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 3,
        marginTop: 15,
    
        paddingHorizontal: 15,
    
        borderWidth: 1,
        borderColor: '#16423C',
        borderRadius: 50,
      },
      textInput: {
        flex: 1,
        marginTop: -12,
    
        color: '#05375a',
      },
      loginContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
      },
      loginContainer1: {
        
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 30,
      },
      header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
      },
      text_header: {
        color: '#16423C',
        fontWeight: 'bold',
        fontSize: 30,
      },
      button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
      },
      inBut: {
        width: '70%',
        backgroundColor: '#16423C',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
      },
      inBut2: {
        backgroundColor: '#16423C',
        height: 65,
        width: 65,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bottomButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      smallIcon2: {
        fontSize: 40,
        // marginRight: 10,
      },
      bottomText: {
        color: 'black',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
      },
      radioButton_div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:20
      },
      radioButton_inner_div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      radioButton_title: {
        fontSize: 20,
        color: '#16423C',
      },
      radioButton_text: {
        fontSize: 16,
        color: 'black',
      },
})

export default styles;