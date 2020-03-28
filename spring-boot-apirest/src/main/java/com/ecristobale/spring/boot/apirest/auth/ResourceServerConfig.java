package com.ecristobale.spring.boot.apirest.auth;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

//Serves the requested page after token validation
@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter{
		
	// Security rules of our resources endpoints
	@Override
	public void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/clientes").permitAll() // public route
			.antMatchers("/h2-console/**").permitAll()
			.anyRequest().authenticated() // all other urls can be access by any authenticated role
			.and().headers().frameOptions().sameOrigin(); //allow use of frame to same origin urls. routes need authentication
			//.and().csrf().ignoringAntMatchers("/h2-console/**")//don't apply CSRF protection to /h2-console
            //.and().headers().frameOptions().sameOrigin()//allow use of frame to same origin urls. routes need authentication
            //.and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // without session management
	}
	
}